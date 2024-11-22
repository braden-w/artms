import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { COLUMNS_IN_DATABASE } from "../COLUMNS_IN_DATABASE";
import type { ColumnInDatabase } from "../COLUMNS_IN_DATABASE";
import type { Filter } from "../../conditions";

const columnTypeOptions = [
	"ID",
	"Text",
	"Textarea",
	"Number",
	"Select",
	"Multi-select",
	"Date",
	"Checkbox",
] as const;

export const optionsSchema = z.object({
	value: z.string(),
	color: z.string(),
});

export type Option = z.infer<typeof optionsSchema>;

export const columnsTable = sqliteTable("columns", {
	name: text().primaryKey(),
	type: text("type", { enum: columnTypeOptions }).notNull(),
	position: real("position").notNull(),
	isArray: integer("is_array", { mode: "boolean" }).notNull(),
	options: text("options", { mode: "json" }).$type<Option[]>().notNull(),
	filter: text("filter", { mode: "json" }).$type<Filter>(),
	dateDisplayFormat: text("date_display_format").notNull(),
	shortcut: text(),
});

export const PROPERTIES = COLUMNS_IN_DATABASE.map((column) => column.name);

export const propertySchema = z
	.string()
	.refine(
		(n): n is ColumnInDatabase["name"] =>
			PROPERTIES.includes(n as ColumnInDatabase["name"]),
		{ message: "The column name must be a valid column name" },
	);

export type Column = typeof columnsTable.$inferSelect;
