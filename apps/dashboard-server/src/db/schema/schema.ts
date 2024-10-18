import {
	integer,
	numeric,
	real,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: integer("expires_at").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	googleAccessToken: text("google_access_token").notNull(),
	googleRefreshToken: text("google_refresh_token"),
	googleAccessTokenExpiresAt: integer(
		"google_access_token_expires_at",
	).notNull(),
	googleIdToken: text("google_id_token").notNull(),
});

export const users = sqliteTable(
	"users",
	{
		id: text().primaryKey().notNull(),
		googleEmail: text("google_email").notNull(),
		googleId: text("google_id"),
	},
	(table) => {
		return {
			googleIdUnique: uniqueIndex("users_google_id_unique").on(table.googleId),
		};
	},
);

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

export const columnsTable = sqliteTable("columns", {
	name: text("name").primaryKey(),
	type: text("type", { enum: columnTypeOptions }).notNull(),
	position: real("position").notNull(),
	isArray: integer("is_array", { mode: "boolean" }).notNull(),
	options: text("options", { mode: "json" }).$type<Option[]>().notNull(),
	filter: text("filter", { mode: "json" }).$type<Filter>(),
	dateDisplayFormat: text("date_display_format").notNull(),
	shortcut: text("shortcut"),
	// autofill: messageSchema.array().optional(),
});

type Column = typeof columnsTable.$inferSelect;

export const embeddings = sqliteTable("embeddings", {
	id: text().primaryKey().notNull(),
	pageId: text("page_id").notNull(),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull(),
	embedding: numeric().notNull(),
});

export const pagesTable = sqliteTable("pages", {
	title: text(),
	content: text(),
	resonance: text(),
	date: text(),
	timezone: text(),
	createdAt: text("created_at"),
	updatedAt: text("updated_at"),
	"type/book/goodreadsUrl": text("type/Book/goodreads_url"),
	"type/article/url": text("type/Article/url"),
	"type/project/deploymentUrl": text("type/Project/deployment_url"),
	"type/project/githubUrl": text("type/Project/github_url"),
	"type/gitHubRepository/url": text("type/GitHub Repository/url"),
	"type/prompt/systemPrompt": text("type/Prompt/system_prompt"),
	"type/prompt/userPrompt": text("type/Prompt/user_prompt"),
	"type/restaurant/yelpUrl": text("type/Restaurant/yelp_url"),
	"type/blog/builtWith": text("type/Blog/built_with"),
	"type/event/description": text("type/Event/description"),
	"type/book/link": text("type/Book/link"),
	"type/comment/videoId": text("type/Comment/video_id"),
	"type/excerpt/source": text("type/Excerpt/source"),
	"type/tool/url": text("type/Tool/url"),
	"type/tool/title": text("type/Tool/title"),
	"type/email/subject": text("type/Email/subject"),
	"type/video/url": text("type/Video/url"),
	"type/restaurant/recommendedBy": text("type/Restaurant/recommended_by"),
	"type/quote/from": text("type/Quote/from"),
	contentDraft: text("content_draft"),
	contentReview: text("content_review"),
	status: text(),
	subtitle: text(),
	url: text(),
	visibility: text(),
	alias: text(),
	on: text(),
	type: text(),
	postOn: text("post_on"),
	tags: text(),
	id: text().primaryKey().notNull(),
	references: text(),
});

export type Page = typeof pagesTable.$inferSelect;

export const slugs = sqliteTable(
	"slugs",
	{
		id: text().primaryKey().notNull(),
		slugText: text("slug_text").notNull(),
		pageId: text("page_id").notNull(),
		timestamp: text().default("sql`(CURRENT_TIMESTAMP)`"),
	},
	(table) => {
		return {
			slugTextPageId: uniqueIndex("slugs_slug_text_page_id").on(
				table.slugText,
				table.pageId,
			),
		};
	},
);

export const googlePhotos = sqliteTable(
	"google_photos",
	{
		assetId: text("asset_id").references(() => assets.id),
		id: text().primaryKey().notNull(),
		description: text({ length: 1000 }),
		productUrl: text().notNull(),
		baseUrl: text().notNull(),
		mimeType: text().notNull(),
		mediaMetadata: text().notNull(),
		contributorInfo: text(),
		filename: text().notNull(),
	},
	(table) => {
		return {
			assetIdUnique: uniqueIndex("google_photos_asset_id_unique").on(
				table.assetId,
			),
		};
	},
);

export const releases = sqliteTable("releases", {
	id: text().primaryKey().notNull(),
	createdAt: text("created_at").notNull(),
	pageId: text("page_id").notNull(),
	fullText: text("full_text").notNull(),
	visibility: text().notNull(),
});

export const posts = sqliteTable("posts", {
	id: text().primaryKey().notNull(),
	createdAt: text("created_at").notNull(),
	releaseId: text("release_id").notNull(),
	channelId: text("channel_id").notNull(),
});

export const recordings = sqliteTable("recordings", {
	releaseId: text("release_id").notNull(),
	createdAt: text("created_at").notNull(),
	recordingDurationMs: integer("recording_duration_ms").notNull(),
	transcript: text().notNull(),
});

export const releasesAssets = sqliteTable("releases_assets", {
	createdAt: text("created_at").notNull(),
	releaseId: text("release_id").notNull(),
	assetId: text("asset_id").notNull(),
	position: integer().notNull(),
	startTimeMs: integer("start_time_ms").notNull(),
	durationMs: integer("duration_ms").notNull(),
});

export const assets = sqliteTable("assets", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	extension: text().notNull(),
	pageId: text("page_id").notNull(),
	createdAt: text("created_at").notNull(),
	mimeType: text("mime_type"),
	totalDurationMs: integer("total_duration_ms").notNull(),
});

export const channels = sqliteTable("channels", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	platform: text(),
});
