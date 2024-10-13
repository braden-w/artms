-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
 CREATE TABLE IF NOT EXISTS `sessions` (
 `id` text PRIMARY KEY NOT NULL,
 `expires_at` integer NOT NULL,
 `user_id` text NOT NULL,
 `google_access_token` text NOT NULL,
 `google_refresh_token` text,
 `google_access_token_expires_at` integer NOT NULL,
 `google_id_token` text NOT NULL,
 FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `users` (
 `id` text PRIMARY KEY NOT NULL,
 `google_email` text NOT NULL,
 `google_id` text
 );
 --> statement-breakpoint
 CREATE UNIQUE INDEX IF NOT EXISTS `users_google_id_unique` ON `users` (`google_id`);--> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `columns` (
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
 CREATE TABLE IF NOT EXISTS `embeddings` (
 `id` text PRIMARY KEY NOT NULL,
 `page_id` text NOT NULL,
 `created_at` text NOT NULL,
 `updated_at` text NOT NULL,
 `embedding` numeric NOT NULL
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `pages` (
 `title` text,
 `content` text,
 `resonance` text,
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
 `status` text,
 `subtitle` text,
 `url` text,
 `visibility` text,
 `alias` text,
 `on` text,
 `type` text,
 `post_on` text,
 `tags` text,
 `id` text PRIMARY KEY NOT NULL,
 `references` text
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `slugs` (
 `id` text PRIMARY KEY NOT NULL,
 `slug_text` text NOT NULL,
 `page_id` text NOT NULL,
 `timestamp` text DEFAULT (CURRENT_TIMESTAMP)
 );
 --> statement-breakpoint
 CREATE UNIQUE INDEX IF NOT EXISTS `slugs_slug_text_page_id` ON `slugs` (`slug_text`,`page_id`);--> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `google_photos` (
 `asset_id` text,
 `id` text PRIMARY KEY NOT NULL,
 `description` text(1000),
 `productUrl` text NOT NULL,
 `baseUrl` text NOT NULL,
 `mimeType` text NOT NULL,
 `mediaMetadata` text NOT NULL,
 `contributorInfo` text,
 `filename` text NOT NULL,
 FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE no action
 );
 --> statement-breakpoint
 CREATE UNIQUE INDEX IF NOT EXISTS `google_photos_asset_id_unique` ON `google_photos` (`asset_id`);--> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `releases` (
 `id` text PRIMARY KEY NOT NULL,
 `created_at` text NOT NULL,
 `page_id` text NOT NULL,
 `full_text` text NOT NULL,
 `visibility` text NOT NULL
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `posts` (
 `id` text PRIMARY KEY NOT NULL,
 `created_at` text NOT NULL,
 `release_id` text NOT NULL,
 `channel_id` text NOT NULL
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `recordings` (
 `release_id` text NOT NULL,
 `created_at` text NOT NULL,
 `recording_duration_ms` integer NOT NULL,
 `transcript` text NOT NULL
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `releases_assets` (
 `created_at` text NOT NULL,
 `release_id` text NOT NULL,
 `asset_id` text NOT NULL,
 `position` integer NOT NULL,
 `start_time_ms` integer NOT NULL,
 `duration_ms` integer NOT NULL
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `assets` (
 `id` text PRIMARY KEY NOT NULL,
 `name` text NOT NULL,
 `extension` text NOT NULL,
 `page_id` text NOT NULL,
 `created_at` text NOT NULL,
 `mime_type` text,
 `total_duration_ms` integer NOT NULL
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `pages_fts` (
 `id` numeric,
 `title` numeric,
 `content` numeric,
 `pages_fts` numeric,
 `rank` numeric
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `pages_fts_data` (
 `id` integer PRIMARY KEY,
 `block` blob
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `pages_fts_idx` (
 `segid` numeric NOT NULL,
 `term` numeric NOT NULL,
 `pgno` numeric,
 PRIMARY KEY(`segid`, `term`)
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `pages_fts_content` (
 `id` integer PRIMARY KEY,
 `c0` numeric,
 `c1` numeric,
 `c2` numeric
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `pages_fts_docsize` (
 `id` integer PRIMARY KEY,
 `sz` blob
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `pages_fts_config` (
 `k` numeric PRIMARY KEY NOT NULL,
 `v` numeric
 );
 --> statement-breakpoint
 CREATE TABLE IF NOT EXISTS `channels` (
 `id` text PRIMARY KEY NOT NULL,
 `name` text NOT NULL,
 `platform` text
 );