import { COLUMNS_IN_DATABASE } from "@/db/COLUMNS_IN_DATABASE";
import { nanoid } from "@/utils";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { embeddings } from "./embeddings";
import { releasesTable } from "./postsReleases";

const SINGLE_VALUE_PROPERTIES = COLUMNS_IN_DATABASE.filter(
	(column) => column.isArray === false,
).map(({ name }) => name);

const MULTI_VALUE_PROPERTIES = COLUMNS_IN_DATABASE.filter(
	(column) => column.isArray === true,
).map(({ name }) => name);

type SingleValueProperty = (typeof SINGLE_VALUE_PROPERTIES)[number];
type MultiValueProperty = (typeof MULTI_VALUE_PROPERTIES)[number];

export const pagesTable = sqliteTable("pages", ({ text, customType }) => {
	/**
	 * Column that parses text as an array of strings. Gracefully handles strings that are not valid JSON string arrays.
	 * */
	const textArray = customType<{
		data: string[];
		driverData: string;
	}>({
		dataType: () => "TEXT",
		fromDriver: (v) => {
			try {
				const maybeStringArray = JSON.parse(v);
				const stringArray = z.string().array().parse(maybeStringArray);
				return stringArray;
			} catch {
				return [v];
			}
		},
		toDriver: (v) => JSON.stringify(v),
	});

	const singleValueColumns = Object.fromEntries(
		SINGLE_VALUE_PROPERTIES.map((colName) => [colName, text(colName)]),
	) as {
		[K in SingleValueProperty]: ReturnType<
			typeof text<K, string, readonly [string, ...string[]], "json" | "text">
		>;
	};

	const multiValueColumns = Object.fromEntries(
		MULTI_VALUE_PROPERTIES.map((colName) => [colName, textArray(colName)]),
	) as { [K in MultiValueProperty]: ReturnType<typeof textArray> };

	const overrideColumns = {
		id: text("id")
			.primaryKey()
			.$defaultFn(() => nanoid()),
	} as const;

	return {
		...singleValueColumns,
		...multiValueColumns,
		...overrideColumns,
	};
});

export const selectPageSchema = z.object({
	...(Object.fromEntries(
		SINGLE_VALUE_PROPERTIES.map((colName) => [colName, z.string().nullable()]),
	) as Record<SingleValueProperty, z.ZodNullable<z.ZodString>>),
	...(Object.fromEntries(
		MULTI_VALUE_PROPERTIES.map((colName) => [colName, z.array(z.string())]),
	) as Record<MultiValueProperty, z.ZodArray<z.ZodString>>),
	id: z.string(),
});

export type SelectPage = z.infer<typeof selectPageSchema>;

export const insertPageSchema = selectPageSchema.partial();

export type InsertPage = z.infer<typeof insertPageSchema>;

export const markdownPageSchema = insertPageSchema.extend({ id: z.string() });
export type MarkdownPage = z.infer<typeof markdownPageSchema>;

export const PagePropertyValue = z.union([
	z.string(),
	z.string().array(),
	z.null(),
]);

export type PagePropertyValue = z.infer<typeof PagePropertyValue>;

export const pagesFts = sqliteTable("pages_fts", {
	rowid: integer("rowid").notNull(),
	id: text("id").notNull(),
	title: text("title").notNull(),
	content: text("content").notNull(),
});

export type PageFts = typeof pagesFts.$inferSelect;

export const pagesRelations = relations(pagesTable, ({ many }) => ({
	embeddings: many(embeddings),
	releases: many(releasesTable),
}));
