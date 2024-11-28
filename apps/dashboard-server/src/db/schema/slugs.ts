import { pagesTable } from "#db/schema/pages";
import { nanoid } from "#utils";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const slugsTable = sqliteTable(
	"slugs",
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => nanoid()),
		slug_text: text().notNull(),
		page_id: text().notNull(),
		timestamp: text().default(sql`(CURRENT_TIMESTAMP)`),
	},
	(t) => ({
		unq: unique("slugs_slug_text_page_id").on(t.slug_text, t.page_id),
	}),
);

export const slugsRelations = relations(slugsTable, ({ one }) => ({
	pages: one(pagesTable, {
		fields: [slugsTable.page_id],
		references: [pagesTable.id],
	}),
}));
