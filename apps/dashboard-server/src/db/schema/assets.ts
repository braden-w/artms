import type { ContributorInfo, MediaMetadata } from "@/googlePhotos";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { pagesTable } from "./pages";
import { releasesTable } from "./postsReleases";

export const assetsTable = sqliteTable("assets", {
	id: text("id").primaryKey(),
	extension: text("extension").notNull(),
	name: text("name").notNull(),
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
	productUrl: text("productUrl").notNull(),
	baseUrl: text("baseUrl").notNull(),
	mimeType: text("mimeType").notNull(),
	mediaMetadata: text("mediaMetadata", { mode: "json" })
		.$type<MediaMetadata>()
		.notNull(),
	contributorInfo: text("contributorInfo", {
		mode: "json",
	}).$type<ContributorInfo>(),
	filename: text("filename").notNull(),
});

export const googlePhotosRelations = relations(googlePhotos, ({ one }) => ({
	asset: one(assetsTable, {
		fields: [googlePhotos.assetId],
		references: [assetsTable.id],
	}),
}));
