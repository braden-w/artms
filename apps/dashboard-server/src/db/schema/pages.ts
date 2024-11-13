import { COLUMNS_IN_DATABASE } from "@/db/COLUMNS_IN_DATABASE";
import { nanoid } from "@/utils";
import { relations } from "drizzle-orm";
import {
	customType,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { Schema, z } from "zod";
import { embeddings } from "./embeddings";
import { makeNullableSchemasOptionalWithDefaultNull } from "./makeNullableSchemasOptionalWithDefaultNull";
import { releasesTable } from "./postsReleases";

const COLUMNS_EXCEPT_ID = COLUMNS_IN_DATABASE.filter(
	(column) => column.name !== "id",
);

const TEXT_COLUMNS = COLUMNS_EXCEPT_ID.filter(
	(column) => column.isArray === false,
);

const TEXT_ARRAY_COLUMNS = COLUMNS_EXCEPT_ID.filter(
	(column) => column.isArray === true,
);

type TextColumn = (typeof TEXT_COLUMNS)[number];
type TextArrayColumn = (typeof TEXT_ARRAY_COLUMNS)[number];

export const pagesTable = sqliteTable("pages", ({ text, customType }) => {
	/**
	 * Column that parses text as an array of strings. Gracefully handles strings that are not valid JSON string arrays.
	 * */
	const textArray = customType<{
		data: string[];
		driverData: string;
	}>({
		dataType() {
			return "TEXT";
		},
		fromDriver(v) {
			try {
				return z.string().array().parse(JSON.parse(v));
			} catch {
				return [v];
			}
		},
		toDriver(v) {
			return JSON.stringify(v);
		},
	});

	return {
		...(Object.fromEntries(
			TEXT_COLUMNS.map(({ name: colName }) => [colName, text(colName)]),
		) as {
			[K in TextColumn["name"]]: ReturnType<
				typeof text<K, string, readonly [string, ...string[]], "json" | "text">
			>;
		}),

		...(Object.fromEntries(
			TEXT_ARRAY_COLUMNS.map(({ name: colName }) => [
				colName,
				textArray(colName),
			]),
		) as {
			[K in TextArrayColumn["name"]]: ReturnType<typeof textArray<K>>;
		}),

		id: text("id")
			.primaryKey()
			.$defaultFn(() => nanoid()),
	};
});

export const Page = createSelectSchema(pagesTable);
//   {
// 	...(Object.fromEntries(
// 		TEXT_COLUMNS.map(({ name: colName }) => [colName, z.string().nullable()]),
// 	) as Record<TextColumn["name"], z.ZodNullable<z.ZodString>>),
// 	...(Object.fromEntries(
// 		TEXT_ARRAY_COLUMNS.map(({ name: colName }) => [
// 			colName,
// 			z.array(z.string()),
// 		]),
// 	) as Record<TextArrayColumn["name"], z.ZodArray<z.ZodString>>),
// });

export const pagesRelations = relations(pagesTable, ({ one, many }) => ({
	embeddings: one(embeddings, {
		fields: [pagesTable.id],
		references: [embeddings.page_id],
	}),
	releases: many(releasesTable),
}));

export const MarkdownPage = makeNullableSchemasOptionalWithDefaultNull(Page);

export type Page = z.infer<typeof Page>;

export const pagesFts = sqliteTable("pages_fts", {
	rowid: integer("rowid").notNull(),
	id: text("id").notNull(),
	title: text("title").notNull(),
	content: text("content").notNull(),
});

export type PageFts = typeof pagesFts.$inferSelect;

const OptionalStringDefaultNull = Schema.optionalWith(
	Schema.NullOr(Schema.String),
	{ default: () => null },
);

const OptionalStringArrayDefaultNull = Schema.optionalWith(
	Schema.NullOr(Schema.String.pipe(Schema.Array, Schema.mutable)),
	{ default: () => null },
);

export const PageSchema = Schema.Struct({
	...(Object.fromEntries(
		TEXT_COLUMNS.map(({ name: colName }) => [
			colName,
			OptionalStringDefaultNull,
		]),
	) as Record<TextColumn["name"], typeof OptionalStringDefaultNull>),
	...(Object.fromEntries(
		TEXT_ARRAY_COLUMNS.map(({ name: colName }) => [
			colName,
			OptionalStringArrayDefaultNull,
		]),
	) as Record<TextArrayColumn["name"], typeof OptionalStringArrayDefaultNull>),
	id: Schema.String,
});

export const Value = z.union([z.string(), z.string().array(), z.null()]);
export type Value = z.infer<typeof Value>;
