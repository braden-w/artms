ALTER TABLE `users` RENAME COLUMN "google_email" TO "email";--> statement-breakpoint
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
CREATE TABLE `pages_fts` (
	`rowid` integer NOT NULL,
	`id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `audiences` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_audiences` (
	`user_id` text NOT NULL,
	`audience_id` text NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS `users_google_id_unique`;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `google_id`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "user_id", "expires_at", "created_at") SELECT "id", "user_id", "expires_at", "created_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS "google_photos_asset_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "recordings_release_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "slugs_slug_text_page_id";--> statement-breakpoint
ALTER TABLE `embeddings` ALTER COLUMN "embedding" TO "embedding" F32_BLOB(1536) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `google_photos_asset_id_unique` ON `google_photos` (`asset_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recordings_release_id_unique` ON `recordings` (`release_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `slugs_slug_text_page_id` ON `slugs` (`slug_text`,`page_id`);--> statement-breakpoint
ALTER TABLE `pages` ALTER COLUMN "alias" TO "alias" TEXT;--> statement-breakpoint
ALTER TABLE `pages` ALTER COLUMN "on" TO "on" TEXT;--> statement-breakpoint
ALTER TABLE `pages` ALTER COLUMN "type" TO "type" TEXT;--> statement-breakpoint
ALTER TABLE `pages` ALTER COLUMN "post_on" TO "post_on" TEXT;--> statement-breakpoint
ALTER TABLE `pages` ALTER COLUMN "tags" TO "tags" TEXT;--> statement-breakpoint
ALTER TABLE `slugs` ALTER COLUMN "timestamp" TO "timestamp" text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `releases` ADD `audience_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `releases` DROP COLUMN `visibility`;