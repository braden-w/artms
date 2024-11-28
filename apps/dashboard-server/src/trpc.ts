import { env } from "hono/adapter";
import * as schema from "#db/schema";
import { validateEnv } from "#env";
import { createCtxServices } from "#services";
import { createClient as createLibsqlClient } from "@libsql/client";
import { TRPCError, initTRPC } from "@trpc/server";
import { drizzle } from "drizzle-orm/libsql";
import superjson from "superjson";

const t = initTRPC
	.context<{ env: Record<string, string | boolean | number | undefined> }>()
	.create({
		transformer: superjson,
	});

export const router = t.router;
export const publicProcedure = t.procedure;

const createDbFromEnv = (
	rawEnv: Record<string, string | boolean | number | undefined>,
) => {
	const env = validateEnv(rawEnv);
	const libsqlClient = createLibsqlClient({
		url: env.TURSO_REMOTE_DATABASE_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	});
	const db = drizzle(libsqlClient, { schema });
	return db;
};

export type Database = ReturnType<typeof createDbFromEnv>;

// TODO: Implement this
const isAuthed = () => true;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
	if (!isAuthed()) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "User not authenticated",
		});
	}

	const db = createDbFromEnv(env(ctx));

	const services = createCtxServices(db);

	return next({ ctx: { ...ctx, db, services } });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
