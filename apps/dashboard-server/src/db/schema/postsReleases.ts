import { nanoid } from "../../utils";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { assetsTable } from "./assets";
import { pagesTable } from "./pages";
import { createSelectSchema } from "drizzle-zod";
import { users } from "./auth";

export const audiencesTable = sqliteTable("audiences", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text("name").notNull(),
});

export const audiencesRelations = relations(audiencesTable, ({ many }) => ({
	pages: many(pagesTable),
	releases: many(releasesTable),
	usersToAudiences: many(usersToAudiencesTable),
}));

export const usersToAudiencesTable = sqliteTable("users_audiences", {
	user_id: text("user_id").notNull(),
	audience_id: text("audience_id").notNull(),
});

export const usersAudiencesRelations = relations(
	usersToAudiencesTable,
	({ one }) => ({
		user: one(users, {
			fields: [usersToAudiencesTable.user_id],
			references: [users.id],
		}),
		audience: one(audiencesTable, {
			fields: [usersToAudiencesTable.audience_id],
			references: [audiencesTable.id],
		}),
	}),
);

export const releasesTable = sqliteTable("releases", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	createdAt: text("created_at").notNull(),
	audienceId: text("audience_id").notNull(),
	pageId: text("page_id").notNull(),
	fullText: text("full_text").notNull(),
});

export const releasesRelations = relations(releasesTable, ({ one, many }) => ({
	audience: one(audiencesTable, {
		fields: [releasesTable.audienceId],
		references: [audiencesTable.id],
	}),
	page: one(pagesTable, {
		fields: [releasesTable.pageId],
		references: [pagesTable.id],
	}),
	recording: one(recordingsTable, {
		fields: [releasesTable.id],
		references: [recordingsTable.releaseId],
	}),
	assets: many(assetsTable),
	posts: many(postsTable),
}));

export const recordingsTable = sqliteTable("recordings", {
	releaseId: text("release_id").notNull().unique(),
	createdAt: text("created_at").notNull(),

	recordingDurationMs: integer("recording_duration_ms").notNull(),
	transcript: text("transcript").notNull(),
});

export const recordingsRelations = relations(recordingsTable, ({ one }) => ({
	release: one(releasesTable, {
		fields: [recordingsTable.releaseId],
		references: [releasesTable.id],
	}),
}));

export const postsTable = sqliteTable("posts", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	created_at: text("created_at").notNull(),

	releaseId: text("release_id").notNull(),
	channelId: text("channel_id").notNull(),
});

export const postsRelations = relations(postsTable, ({ one }) => ({
	release: one(releasesTable, {
		fields: [postsTable.releaseId],
		references: [releasesTable.id],
	}),
	channel: one(channelsTable, {
		fields: [postsTable.channelId],
		references: [channelsTable.id],
	}),
}));

export const channelsTable = sqliteTable("channels", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text("name").notNull(),
	platform: text("platform", {
		enum: ["medium", "substack", "twitter", "youtube", "instagram", "tiktok"],
	}),
});

export const channelsRelations = relations(channelsTable, ({ many }) => ({
	posts: many(postsTable),
}));

export const releasesAssets = sqliteTable("releases_assets", {
	created_at: text("created_at").notNull(),

	releaseId: text("release_id").notNull(),
	assetId: text("asset_id").notNull(),

	position: integer("position").notNull(), // order or position of the asset in the release
	startTimeMs: integer("start_time_ms").notNull(), // start time of the asset in the release. Always equal to the end time of the previous asset slice in the release
	durationMs: integer("duration_ms").notNull(), // duration of the asset in the release
});

export const assetsToReleasesRelations = relations(
	releasesAssets,
	({ one }) => ({
		release: one(releasesTable, {
			fields: [releasesAssets.releaseId],
			references: [releasesTable.id],
		}),
		asset: one(assetsTable, {
			fields: [releasesAssets.assetId],
			references: [assetsTable.id],
		}),
	}),
);

export const releaseSchema = createSelectSchema(releasesTable);
export type Release = typeof releasesTable.$inferSelect;
