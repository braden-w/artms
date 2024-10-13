import { drizzle } from "drizzle-orm/connect";
import type { Context } from "hono";
import { getEnv } from "../env";

export const getDb = (c: Context) => {
	const env = getEnv(c);
	return drizzle("turso", {
		connection: {
			url: env.TURSO_REMOTE_DATABASE_URL,
			authToken: env.TURSO_AUTH_TOKEN,
		},
	});
};
