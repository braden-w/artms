import { createClient } from "@libsql/client";
import { TRPCError, initTRPC } from "@trpc/server";
import { drizzle } from "drizzle-orm/libsql";
import { validateEnv } from "./env";
import * as schema from "./db/schema";
import { type Column, columnsTable, pagesTable } from "./db/schema";
import { asc, eq, sql } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import { DEFAULT_DATE_DISPLAY_FORMAT } from "./constants";

const t = initTRPC
	.context<{ env: Record<string, string | boolean | number | undefined> }>()
	.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const createDbFromEnv = (
	unvalidatedEnv: Record<string, string | boolean | number | undefined>,
) => {
	const env = validateEnv(unvalidatedEnv);
	const client = createClient({
		url: env.TURSO_REMOTE_DATABASE_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	});
	const db = drizzle(client, { schema });
	return db;
};

export type Database = ReturnType<typeof createDbFromEnv>;

// TODO: Implement this
const isAuthed = () => true;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
	if (!isAuthed()) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "User not authenticated",
		});
	}

	const db = createDbFromEnv(ctx.env);

	const getAllColumns = () =>
		db.query.columnsTable.findMany({
			orderBy: asc(columnsTable.position),
		});

	// const setColumnByName = (column: Column) =>
	// 	db
	// 		.update(columnsTable)
	// 		.set(column)
	// 		.where(eq(columnsTable.name, column.name));

	// const getAllPageProperties = () =>
	// 	db
	// 		.select({ name: sql<string>`name` })
	// 		.from(sql`pragma_table_info(${getTableConfig(pagesTable).name})`)
	// 		.then((columns) => columns.map((column) => column.name));

	// const syncColumnsToPageProperties = async () => {
	// 	const columnsInDb = await getAllColumns();
	// 	const lastColPos = Math.max(0, ...columnsInDb.map((c) => c.position));
	// 	const existingColumnNames = new Set(columnsInDb.map((c) => c.name));
	// 	const allUniquePageProperties = await getAllPageProperties();
	// 	const missingColumnNames = allUniquePageProperties.filter(
	// 		(columnName) => !existingColumnNames.has(columnName),
	// 	);
	// 	const missingColumns: Column[] = missingColumnNames.map(
	// 		(columnName, index): Column => ({
	// 			name: columnName,
	// 			type: "Text",
	// 			isArray: false,
	// 			options: [],
	// 			filter: null,
	// 			dateDisplayFormat: DEFAULT_DATE_DISPLAY_FORMAT,
	// 			position: lastColPos + index + 1,
	// 			shortcut: null,
	// 		}),
	// 	);
	// 	if (missingColumns.length > 0) {
	// 		await db.insert(columnsTable).values(missingColumns);
	// 	}
	// 	const columnsInDbWithMissingColumns = [...columnsInDb, ...missingColumns];
	// 	return columnsInDbWithMissingColumns;
	// };

	return next({ ctx: { ...ctx, db, getAllColumns } });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
