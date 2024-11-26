import { asc, eq, sql } from "drizzle-orm";
import type { Column, InsertPage, SelectPage } from "../db/schema";
import { DEFAULT_DATE_DISPLAY_FORMAT } from "../constants";
import { columnsTable, pagesTable } from "../db/schema";
import type { Database } from "../trpc";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import { COLUMNS_IN_DATABASE } from "../db/COLUMNS_IN_DATABASE";

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
		getAllColumns: () =>
			db.query.columnsTable.findMany({
				orderBy: asc(columnsTable.position),
			}),
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
		insertPage: (page: InsertPage) => db.insert(pagesTable).values(page),
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
		setPage: (page: InsertPage) =>
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
