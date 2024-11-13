import { COLUMNS_IN_DATABASE } from "@/db/COLUMNS_IN_DATABASE";
import { nanoid } from "@/utils";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { embeddings } from "./embeddings";
import { releasesTable } from "./postsReleases";

const COLUMNS_EXCEPT_ID = COLUMNS_IN_DATABASE.filter(
	(column) => column.name !== "id",
);

const SINGLE_VALUE_PROPERTIES = COLUMNS_EXCEPT_ID.filter(
	(column) => column.isArray === false,
);

const MULTI_VALUE_PROPERTIES = COLUMNS_EXCEPT_ID.filter(
	(column) => column.isArray === true,
);

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
		id: text("id")
			.primaryKey()
			.$defaultFn(() => nanoid()),

		...(Object.fromEntries(
			SINGLE_VALUE_PROPERTIES.map(({ name: colName }) => [
				colName,
				text(colName),
			]),
		) as {
			[K in SingleValueProperty["name"]]: ReturnType<
				typeof text<K, string, readonly [string, ...string[]], "json" | "text">
			>;
		}),

		...(Object.fromEntries(
			MULTI_VALUE_PROPERTIES.map(({ name: colName }) => [
				colName,
				textArray(colName),
			]),
		) as {
			[K in MultiValueProperty["name"]]: ReturnType<typeof textArray>;
		}),
	};
});

export const Page = z.object({
	id: z.string(),
	...(Object.fromEntries(
		SINGLE_VALUE_PROPERTIES.map(({ name: colName }) => [
			colName,
			z.string().nullable(),
		]),
	) as Record<SingleValueProperty["name"], z.ZodNullable<z.ZodString>>),
	...(Object.fromEntries(
		MULTI_VALUE_PROPERTIES.map(({ name: colName }) => [
			colName,
			z.array(z.string()),
		]),
	) as Record<MultiValueProperty["name"], z.ZodArray<z.ZodString>>),
});

export type Page = z.infer<typeof Page>;

export const PagePropertyValue = z.union([
	z.string(),
	z.string().array(),
	z.null(),
]);
export type PagePropertyValue = z.infer<typeof PagePropertyValue>;

export const MarkdownPage = z.object({
	id: z.string(),
	...(Object.fromEntries(
		SINGLE_VALUE_PROPERTIES.map(({ name: colName }) => [
			colName,
			z.string().nullable().optional(),
		]),
	) as Record<
		SingleValueProperty["name"],
		z.ZodOptional<z.ZodNullable<z.ZodString>>
	>),
	...(Object.fromEntries(
		MULTI_VALUE_PROPERTIES.map(({ name: colName }) => [
			colName,
			z.array(z.string()).optional(),
		]),
	) as Record<
		MultiValueProperty["name"],
		z.ZodOptional<z.ZodArray<z.ZodString>>
	>),
});

export const pagesFts = sqliteTable("pages_fts", {
	rowid: integer("rowid").notNull(),
	id: text("id").notNull(),
	title: text("title").notNull(),
	content: text("content").notNull(),
});

export type PageFts = typeof pagesFts.$inferSelect;

export const pagesRelations = relations(pagesTable, ({ one, many }) => ({
	embeddings: one(embeddings, {
		fields: [pagesTable.id],
		references: [embeddings.page_id],
	}),
	releases: many(releasesTable),
}));
