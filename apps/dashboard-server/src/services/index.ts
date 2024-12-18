import {
	COLUMNS_IN_DB_FILE_PATH,
	DEFAULT_DATE_DISPLAY_FORMAT,
} from "#constants";
import { COLUMNS_IN_DATABASE } from "#db/COLUMNS_IN_DATABASE";
import type { Column, PagePropertyValue, SelectPage } from "#db/schema/index";
import { columnsTable, pagesFts, pagesTable } from "#db/schema/index";
import type { Database } from "#trpc";
import { generateDefaultPage } from "#utils";
import { TRPCError } from "@trpc/server";
import { asc, eq, sql } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import { z } from "zod";
// import { execa } from "execa";
// import { writeFile } from "node:fs/promises";

const StringWithHtmlFragments = z.string().brand("StringWithHtmlFragments");
export type StringWithHtmlFragments = z.infer<typeof StringWithHtmlFragments>;

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
		getAllColumns: () => COLUMNS_IN_DATABASE,
		// db.query.columnsTable.findMany({
		// 	orderBy: asc(columnsTable.position),
		// }),
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
		getPageById: async (id: string) => {
			const maybePage = await db.query.pagesTable.findFirst({
				where: eq(pagesTable.id, id),
			});
			if (!maybePage) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `Page with id ${id} not found`,
				});
			}
			return maybePage;
		},
		createDefaultPage: async () => {
			const newPage = generateDefaultPage();
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
		createPageWithInitialData: async (partialPage: Partial<SelectPage>) => {
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
		addPage: (page: SelectPage) => db.insert(pagesTable).values(page),
		addPages: async (pages: SelectPage[]) => {
			const rowsChunks = chunkArray(pages, 500);
			for (const rowChunk of rowsChunks) {
				await db.insert(pagesTable).values(rowChunk);
			}
		},
		upsertPage: (page: SelectPage) =>
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
		upsertPages: async (rows: SelectPage[]) => {
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
		replacePage: (page: SelectPage) => {
			const { id, ...updateData } = page;
			return db.update(pagesTable).set(updateData).where(eq(pagesTable.id, id));
		},
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

		getPagesByFts: async ({
			query,
			limit,
			offset,
		}: { query: string; limit: number; offset: number }) => {
			const pages = await db
				.select({
					id: pagesFts.id,
					title:
						sql<StringWithHtmlFragments>`snippet("pages_fts", 1, '<mark>', '</mark>', '...', 50)`.as(
							"title",
						),
					content:
						sql<StringWithHtmlFragments>`snippet("pages_fts", 2, '<mark>', '</mark>', '...', 50)`.as(
							"content",
						),
				})
				.from(pagesFts)
				.where(
					sql`${pagesFts} match 'title:' || ${query} || ' OR content:' || ${query}`,
				)
				.limit(limit)
				.offset(offset);
			return pages;
		},
	};
}

function createSyncServices({
	db,
	columnServices,
}: { db: Database; columnServices: ReturnType<typeof createColumnServices> }) {
	const columnsServices = createColumnServices(db);
	const getAllPageProperties = () =>
		db
			.select({ name: sql<string>`name` })
			.from(sql`pragma_table_info(${getTableConfig(pagesTable).name})`)
			.then((columns) => columns.map((column) => column.name));
	return {
		columns: {
			down: async () => {
				const allColumns = await columnsServices.getAllColumns();
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
