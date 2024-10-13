import { relations } from "drizzle-orm/relations";
import { users, sessions, assets, googlePhotos } from "./schema";

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
}));

export const googlePhotosRelations = relations(googlePhotos, ({ one }) => ({
	asset: one(assets, {
		fields: [googlePhotos.assetId],
		references: [assets.id],
	}),
}));

export const assetsRelations = relations(assets, ({ many }) => ({
	googlePhotos: many(googlePhotos),
}));
