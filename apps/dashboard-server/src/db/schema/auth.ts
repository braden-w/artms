import { relations } from "drizzle-orm";
import {
	sqliteTable,
	text,
	integer,
	primaryKey,
} from "drizzle-orm/sqlite-core";

const PROVIDERS = ["google", "github"] as const;

export const users = sqliteTable("users", {
	id: text().primaryKey(),
	email: text().notNull(),
	createdAt: text("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const authKeys = sqliteTable("auth_keys", {
	id: text().primaryKey(),
	userId: text("user_id").notNull(),
	providerId: text("provider_id", { enum: PROVIDERS }).notNull(),
	providerUserId: text("provider_user_id").notNull(),
	createdAt: text("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const providerTokens = sqliteTable(
	"provider_tokens",
	{
		providerId: text("provider_id", { enum: PROVIDERS }).notNull(),
		userId: text("user_id").notNull(),
		accessToken: text("access_token").notNull(),
		refreshToken: text("refresh_token"),
		accessTokenExpiresAt: integer("access_token_expires_at").notNull(),
		idToken: text("id_token").notNull(),
		createdAt: text("created_at")
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.providerId, table.userId] }),
	}),
);

export const sessions = sqliteTable("sessions", {
	id: text().primaryKey(),
	userId: text("user_id").notNull(),
	expiresAt: integer("expires_at").notNull(),
	createdAt: text("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const usersRelations = relations(users, ({ many }) => ({
	authKeys: many(authKeys),
	providerTokens: many(providerTokens),
	sessions: many(sessions),
}));

export const authKeysRelations = relations(authKeys, ({ one }) => ({
	user: one(users, {
		fields: [authKeys.userId],
		references: [users.id],
	}),
}));

export const providerTokensRelations = relations(providerTokens, ({ one }) => ({
	user: one(users, {
		fields: [providerTokens.userId],
		references: [users.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
