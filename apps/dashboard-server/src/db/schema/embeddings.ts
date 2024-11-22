import { nanoid } from "../../utils";
import { relations } from "drizzle-orm";
import { customType, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { pagesTable } from "./pages";

const embedding = customType<{
	data: ArrayBuffer;
	driverData: Buffer;
	configRequired: true;
	config: { size: number };
}>({
	dataType(config) {
		return `F32_BLOB(${config.size})`;
	},
	fromDriver(value) {
		const arrayBuffer = value.buffer as ArrayBuffer;
		return arrayBuffer;
	},
	toDriver(value) {
		const buffer = Buffer.from(value);
		return buffer;
	},
});

export const embeddings = sqliteTable("embeddings", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	page_id: text("page_id").notNull(),
	created_at: text("created_at").notNull(),
	updated_at: text("updated_at").notNull(),
	embedding: embedding("embedding", { size: 1536 }).notNull(),
});

export type Embedding = typeof embeddings.$inferSelect;

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
	page: one(pagesTable, {
		fields: [embeddings.page_id],
		references: [pagesTable.id],
	}),
}));
