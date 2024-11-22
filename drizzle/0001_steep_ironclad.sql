DROP INDEX IF EXISTS "google_photos_asset_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "recordings_release_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "slugs_slug_text_page_id";--> statement-breakpoint
ALTER TABLE `sessions` ALTER COLUMN "expires_at" TO "expires_at" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `google_photos_asset_id_unique` ON `google_photos` (`asset_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recordings_release_id_unique` ON `recordings` (`release_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `slugs_slug_text_page_id` ON `slugs` (`slug_text`,`page_id`);