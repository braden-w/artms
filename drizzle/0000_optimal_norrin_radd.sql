CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`extension` text NOT NULL,
	`name` text NOT NULL,
	`page_id` text NOT NULL,
	`created_at` text NOT NULL,
	`total_duration_ms` integer NOT NULL,
	`mime_type` text
);
--> statement-breakpoint
CREATE TABLE `google_photos` (
	`asset_id` text,
	`id` text PRIMARY KEY NOT NULL,
	`description` text(1000),
	`product_url` text NOT NULL,
	`base_url` text NOT NULL,
	`mime_type` text NOT NULL,
	`media_metadata` text NOT NULL,
	`contributor_info` text,
	`filename` text NOT NULL,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `google_photos_asset_id_unique` ON `google_photos` (`asset_id`);--> statement-breakpoint
CREATE TABLE `auth_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `provider_tokens` (
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`access_token_expires_at` integer NOT NULL,
	`id_token` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`provider_id`, `user_id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `columns` (
	`name` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`position` real NOT NULL,
	`is_array` integer NOT NULL,
	`options` text NOT NULL,
	`filter` text,
	`date_display_format` text NOT NULL,
	`shortcut` text
);
--> statement-breakpoint
CREATE TABLE `embeddings` (
	`id` text PRIMARY KEY NOT NULL,
	`page_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`embedding` F32_BLOB(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pages_fts` (
	`rowid` integer NOT NULL,
	`id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`content` text,
	`resonance` text,
	`status` text,
	`visibility` text,
	`subtitle` text,
	`date` text,
	`timezone` text,
	`created_at` text,
	`updated_at` text,
	`type/Book/goodreads_url` text,
	`type/Article/url` text,
	`type/Project/deployment_url` text,
	`type/Project/github_url` text,
	`type/GitHub Repository/url` text,
	`type/Prompt/system_prompt` text,
	`type/Prompt/user_prompt` text,
	`type/Restaurant/yelp_url` text,
	`type/Blog/built_with` text,
	`type/Event/description` text,
	`type/Book/link` text,
	`type/Comment/video_id` text,
	`type/Excerpt/source` text,
	`type/Tool/url` text,
	`type/Tool/title` text,
	`type/Email/subject` text,
	`type/Video/url` text,
	`type/Restaurant/recommended_by` text,
	`type/Quote/from` text,
	`content_draft` text,
	`content_review` text,
	`url` text,
	`references` text,
	`on` TEXT,
	`type` TEXT,
	`alias` TEXT,
	`post_on` TEXT,
	`tags` TEXT
);
--> statement-breakpoint
CREATE TABLE `audiences` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `channels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`platform` text
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`release_id` text NOT NULL,
	`channel_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recordings` (
	`release_id` text NOT NULL,
	`created_at` text NOT NULL,
	`recording_duration_ms` integer NOT NULL,
	`transcript` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recordings_release_id_unique` ON `recordings` (`release_id`);--> statement-breakpoint
CREATE TABLE `releases_assets` (
	`created_at` text NOT NULL,
	`release_id` text NOT NULL,
	`asset_id` text NOT NULL,
	`position` integer NOT NULL,
	`start_time_ms` integer NOT NULL,
	`duration_ms` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `releases` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`audience_id` text NOT NULL,
	`page_id` text NOT NULL,
	`full_text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_audiences` (
	`user_id` text NOT NULL,
	`audience_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slugs` (
	`id` text PRIMARY KEY NOT NULL,
	`slug_text` text NOT NULL,
	`page_id` text NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slugs_slug_text_page_id` ON `slugs` (`slug_text`,`page_id`);