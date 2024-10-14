import { createEnv } from "@t3-oss/env-core";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

export const env = createEnv({
	server: {
		TURSO_LOCAL_DATABASE_URL: z.string().optional(),
		TURSO_REMOTE_DATABASE_URL: z.string(),
		TURSO_AUTH_TOKEN: z.string(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});

export default defineConfig({
	out: "./drizzle",
	schema: "./apps/dashboard-server/src/db/schema/index.ts",
	dialect: "turso",
	dbCredentials: {
		url: env.TURSO_REMOTE_DATABASE_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	},
});
