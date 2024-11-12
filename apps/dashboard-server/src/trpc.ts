import { createClient } from "@libsql/client";
import { TRPCError, initTRPC } from "@trpc/server";
import { drizzle } from "drizzle-orm/libsql";
import { validateEnv } from "./env";
import * as schema from "./db/schema";

const t = initTRPC
	.context<{ env: Record<string, string | boolean | number | undefined> }>()
	.create();

export const router = t.router;
export const publicProcedure = t.procedure;

// TODO: Implement this
const isAuthed = () => true;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
	if (!isAuthed()) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "User not authenticated",
		});
	}

	const env = validateEnv(ctx.env);

	const client = createClient({
		url: env.TURSO_REMOTE_DATABASE_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	});
	const db = drizzle(client, { schema });

	return next({ ctx: { ...ctx, db } });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
