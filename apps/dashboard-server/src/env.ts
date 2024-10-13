import { createEnv } from "@t3-oss/env-core";
import type { Context } from "hono";
import { env } from "hono/adapter";
import { z } from "zod";

export const getEnv = (c: Context) =>
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

		/**
		 * The prefix that client-side variables must have. This is enforced both at
		 * a type-level and at runtime.
		 */
		clientPrefix: "PUBLIC_",

		client: {},

		/**
		 * What object holds the environment variables at runtime. This is usually
		 * `process.env` or `import.meta.env`.
		 */
		runtimeEnv: env(c),

		/**
		 * By default, this library will feed the environment variables directly to
		 * the Zod validator.
		 *
		 * This means that if you have an empty string for a value that is supposed
		 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
		 * it as a type mismatch violation. Additionally, if you have an empty string
		 * for a value that is supposed to be a string with a default value (e.g.
		 * `DOMAIN=` in an ".env" file), the default value will never be applied.
		 *
		 * In order to solve these issues, we recommend that all new projects
		 * explicitly specify this option as true.
		 */
		emptyStringAsUndefined: true,
	});
