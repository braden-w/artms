import { createEnv } from "@t3-oss/env-core";
import type { Context } from "hono";
import { env } from "hono/adapter";
import { z } from "zod";

export const getEnv = (c: Context) => validateEnv(env(c));

export const validateEnv = <E extends Record<string, string>>(env: E) =>
	createEnv({
		server: {
			TURSO_LOCAL_DATABASE_URL: z.string().optional(),
			TURSO_REMOTE_DATABASE_URL: z.string(),
			TURSO_AUTH_TOKEN: z.string(),
			BUNNY_TOKEN: z.string(),
			TODOIST_API_TOKEN: z.string(),
			TIPTAP_PRO_TOKEN: z.string(),
			OPENAI_API_KEY: z.string(),
			ANTHROPIC_API_KEY: z.string(),
			GOOGLE_CLIENT_ID: z.string(),
			GOOGLE_CLIENT_SECRET: z.string(),
			GROQ_API_KEY: z.string(),
			FULL_BASE_URL: z.string(),
		},
		clientPrefix: "PUBLIC_",
		client: {},
		runtimeEnv: env,
		emptyStringAsUndefined: true,
	});
