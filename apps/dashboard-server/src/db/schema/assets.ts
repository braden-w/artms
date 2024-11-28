import { pagesTable } from "#db/schema/pages";
import { releasesTable } from "#db/schema/postsReleases";
import type { ContributorInfo, MediaMetadata } from "#googlePhotos";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const assetsTable = sqliteTable("assets", {
	id: text().primaryKey(),
	extension: text().notNull(),
	name: text().notNull(),
	pageId: text("page_id").notNull(),
	createdAt: text("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	totalDurationMs: integer("total_duration_ms").notNull(),
	mimeType: text("mime_type"),
});

export type AssetFromDb = typeof assetsTable.$inferSelect;

export const assetRelations = relations(assetsTable, ({ one, many }) => ({
	assets: one(pagesTable, {
		fields: [assetsTable.pageId],
		references: [pagesTable.id],
	}),
	releases: many(releasesTable),
}));

export const googlePhotos = sqliteTable("google_photos", {
	assetId: text("asset_id")
		.unique()
		.references(() => assetsTable.id),
	id: text("id").primaryKey(),
	description: text("description", { length: 1000 }),
	productUrl: text("product_url").notNull(),
	baseUrl: text("base_url").notNull(),
	mimeType: text("mime_type").notNull(),
	mediaMetadata: text("media_metadata", { mode: "json" })
		.$type<MediaMetadata>()
		.notNull(),
	contributorInfo: text("contributor_info", {
		mode: "json",
	}).$type<ContributorInfo>(),
	filename: text().notNull(),
});

export const googlePhotosRelations = relations(googlePhotos, ({ one }) => ({
	asset: one(assetsTable, {
		fields: [googlePhotos.assetId],
		references: [assetsTable.id],
	}),
}));
