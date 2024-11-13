import * as schema from "@/db/schema";
import { validateEnv } from "@/env";
import { createCtxServices } from "@/services";
import { createClient as createLibsqlClient } from "@libsql/client";
import { TRPCError, initTRPC } from "@trpc/server";
import { drizzle } from "drizzle-orm/libsql";

const t = initTRPC
	.context<{ env: Record<string, string | boolean | number | undefined> }>()
	.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const createDbFromEnv = (
	unvalidatedEnv: Record<string, string | boolean | number | undefined>,
) => {
	const env = validateEnv(unvalidatedEnv);
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

	const db = createDbFromEnv(ctx.env);

	const services = createCtxServices(db);

	return next({ ctx: { ...ctx, db, services } });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
