DROP TABLE IF EXISTS `pages_fts`;--> statement-breakpoint
DROP TRIGGER IF EXISTS `pages_ai`;--> statement-breakpoint
DROP TRIGGER IF EXISTS `pages_ad`;--> statement-breakpoint
DROP TRIGGER IF EXISTS `pages_au`;--> statement-breakpoint
DROP INDEX IF EXISTS "google_photos_asset_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "slugs_slug_text_page_id";--> statement-breakpoint
DROP INDEX IF EXISTS "users_google_id_unique";--> statement-breakpoint
ALTER TABLE `slugs` ALTER COLUMN "timestamp" TO "timestamp" text DEFAULT 'sql`(CURRENT_TIMESTAMP)`';--> statement-breakpoint
CREATE UNIQUE INDEX `google_photos_asset_id_unique` ON `google_photos` (`asset_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `slugs_slug_text_page_id` ON `slugs` (`slug_text`,`page_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_id_unique` ON `users` (`google_id`);