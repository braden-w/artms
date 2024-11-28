import {
	COLUMNS_IN_DB_FILE_PATH,
	DEFAULT_DATE_DISPLAY_FORMAT,
} from "#constants";
import { COLUMNS_IN_DATABASE } from "#db/COLUMNS_IN_DATABASE";
import type {
	Column,
	InsertPage,
	PagePropertyValue,
	SelectPage,
} from "#db/schema/index";
import { columnsTable, pagesTable } from "#db/schema/index";
import type { Database } from "#trpc";
import { generateDefaultPage } from "#utils";
import { TRPCError } from "@trpc/server";
import { asc, eq, sql } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import { writeFile } from "node:fs/promises";
import { execa } from "execa";

export function createCtxServices(db: Database) {
	const columnServices = createColumnServices(db);
	const pageServices = createPageService(db);
	const syncServices = createSyncServices({ db, columnServices });
	return {
		columns: columnServices,
		pages: pageServices,
		sync: syncServices,
	};
}

function createColumnServices(db: Database) {
	return {
		getAllColumns: async () => {
			const allColumns = await db.query.columnsTable.findMany({
				orderBy: asc(columnsTable.position),
			});
			const isLocalColumnsUpToDate = areArraysEqual(
				COLUMNS_IN_DATABASE,
				allColumns,
			);
			if (!isLocalColumnsUpToDate) {
				const columnsWithPositionsConvertedToSequenceOfInts = allColumns.map(
					({ position, ...c }, i) => ({ ...c, position: i }),
				);
				const fileContent = `import type { Column } from '@repo/db/schema';

export const columnsInDatabase = ${JSON.stringify(columnsWithPositionsConvertedToSequenceOfInts, null, 2)} as const satisfies Column[];

export type ColumnInDatabase = (typeof columnsInDatabase)[number];
`.trim();
				await writeFile(COLUMNS_IN_DB_FILE_PATH, fileContent);
				await execa("pnpm", [
					"biome",
					"check",
					"--write",
					COLUMNS_IN_DB_FILE_PATH,
				]);
			}
			return COLUMNS_IN_DATABASE;
		},
		setColumnByName: (column: Column) =>
			db
				.update(columnsTable)
				.set(column)
				.where(eq(columnsTable.name, column.name)),
	};
}

function createPageService(db: Database) {
	const OFFSET_SIZE = 1000;

	const chunkArray = <T>(array: T[], chunkSize: number) => {
		const chunkedResults: T[][] = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			const chunk = array.slice(i, i + chunkSize);
			chunkedResults.push(chunk);
		}
		return chunkedResults;
	};

	return {
		getAllPages: async () => {
			let page = 0;
			const rows: SelectPage[] = [];
			let rs: SelectPage[];
			do {
				rs = await db
					.select()
					.from(pagesTable)
					.limit(OFFSET_SIZE)
					.offset(page * OFFSET_SIZE);
				rows.push(...rs);
				page++;
			} while (rs.length === OFFSET_SIZE);
			return rows;
		},
		getPageById: (id: string) =>
			db.query.pagesTable.findFirst({ where: eq(pagesTable.id, id) }),
		createPage: async (partialPage?: InsertPage) => {
			const newPage = generateDefaultPage(partialPage);
			const [insertedPage] = await db
				.insert(pagesTable)
				.values(newPage)
				.returning();
			if (!insertedPage) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: `Failed to insert page with id ${newPage.id}`,
				});
			}
			return insertedPage;
		},
		insertPages: async (pages: InsertPage[]) => {
			const rowsChunks = chunkArray(pages, 500);
			for (const rowChunk of rowsChunks) {
				await db.insert(pagesTable).values(rowChunk);
			}
		},
		upsertPage: (page: InsertPage) =>
			db
				.insert(pagesTable)
				.values(page)
				.onConflictDoUpdate({
					target: pagesTable.id,
					set: Object.fromEntries(
						COLUMNS_IN_DATABASE.filter((column) => column.name !== "id").map(
							({ name: columnName }) => [
								columnName,
								sql.raw(`excluded.\`${pagesTable[columnName].name}\``),
							],
						),
					),
				}),
		upsertPages: async (rows: InsertPage[]) => {
			const rowsChunks = chunkArray(rows, 500);
			for (const rowChunk of rowsChunks) {
				await db
					.insert(pagesTable)
					.values(rowChunk)
					.onConflictDoUpdate({
						target: pagesTable.id,
						set: Object.fromEntries(
							COLUMNS_IN_DATABASE.filter((column) => column.name !== "id").map(
								({ name: columnName }) => [
									columnName,
									sql.raw(`excluded.\`${pagesTable[columnName].name}\``),
								],
							),
						),
					});
			}
		},
		setPage: (page: SelectPage) =>
			db.update(pagesTable).set(page).where(eq(pagesTable.id, page.id)),
		setPageProperty: ({
			pageId,
			property,
			value,
		}: {
			pageId: string;
			property: string;
			value: PagePropertyValue;
		}) =>
			db
				.update(pagesTable)
				.set({ [property]: value })
				.where(eq(pagesTable.id, pageId)),
		deletePageById: (id: string) =>
			db.delete(pagesTable).where(eq(pagesTable.id, id)),
		deleteAllPages: () => db.delete(pagesTable),
	};
}

function createSyncServices({
	db,
	columnServices,
}: { db: Database; columnServices: ReturnType<typeof createColumnServices> }) {
	const getAllPageProperties = () =>
		db
			.select({ name: sql<string>`name` })
			.from(sql`pragma_table_info(${getTableConfig(pagesTable).name})`)
			.then((columns) => columns.map((column) => column.name));
	return {
		columns: {
			down: async () => {},
		},
		syncColumnsToPageProperties: async () => {
			const columnsInDb = await columnServices.getAllColumns();
			const lastColPos = Math.max(0, ...columnsInDb.map((c) => c.position));
			const existingColumnNames = new Set(columnsInDb.map((c) => c.name));
			const allUniquePageProperties = await getAllPageProperties();
			const missingColumnNames = allUniquePageProperties.filter(
				(columnName) => !existingColumnNames.has(columnName),
			);
			const missingColumns: Column[] = missingColumnNames.map(
				(columnName, index): Column => ({
					name: columnName,
					type: "Text",
					isArray: false,
					options: [],
					filter: null,
					dateDisplayFormat: DEFAULT_DATE_DISPLAY_FORMAT,
					position: lastColPos + index + 1,
					shortcut: null,
				}),
			);
			if (missingColumns.length > 0) {
				await db.insert(columnsTable).values(missingColumns);
			}
			const columnsInDbWithMissingColumns = [...columnsInDb, ...missingColumns];
			return columnsInDbWithMissingColumns;
		},
	};
}

function areArraysEqual<T extends Record<string, unknown>>(
	array1: T[],
	array2: T[],
) {
	if (array1.length !== array2.length) return false;
	return array1.every((obj1, i) => {
		const obj2 = array2[i];
		if (!obj2) return false;
		const areObjsDeepEqual =
			Object.keys(obj1).length === Object.keys(obj2).length &&
			Object.keys(obj1).every((key) => obj1[key] === obj2[key]);
		return areObjsDeepEqual;
	});
}
