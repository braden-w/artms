import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { Context } from "hono";
import { getEnv } from "../env";
import * as schema from "./schema";

export const getDb = <T extends Context>(c: T) => {
	const env = getEnv(c);
	const client = createClient({
		url: env.TURSO_REMOTE_DATABASE_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	});
	return drizzle(client, { schema });
};
