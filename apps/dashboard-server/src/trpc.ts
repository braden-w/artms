import { initTRPC, TRPCError } from "@trpc/server";
import { getDb } from "./db/db";
import type { Context } from "hono";

const t = initTRPC.context<Context>().create();

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

	const db = await getDb(ctx);
	return next({
		ctx: {
			...ctx,
			db,
		},
	});
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
