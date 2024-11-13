import { asc, eq, sql } from "drizzle-orm";
import type { Column } from "../db/schema";
import { DEFAULT_DATE_DISPLAY_FORMAT } from "../constants";
import { columnsTable, pagesTable } from "../db/schema";
import type { Database } from "../trpc";
import { getTableConfig } from "drizzle-orm/sqlite-core";

export function createContextUtils(db: Database) {
	const columnUtils = createColumnUtils(db);
	const syncUtils = createSyncUtils({ db, columnUtils });
	return {
		columns: columnUtils,
		pages: {},
		sync: syncUtils,
	};
}

function createColumnUtils(db: Database) {
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

function createSyncUtils({
	db,
	columnUtils,
}: { db: Database; columnUtils: ReturnType<typeof createColumnUtils> }) {
	const getAllPageProperties = () =>
		db
			.select({ name: sql<string>`name` })
			.from(sql`pragma_table_info(${getTableConfig(pagesTable).name})`)
			.then((columns) => columns.map((column) => column.name));
	return {
		syncColumnsToPageProperties: async () => {
			const columnsInDb = await columnUtils.getAllColumns();
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
