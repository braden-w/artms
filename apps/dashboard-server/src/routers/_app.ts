import { publicProcedure, router } from "#trpc";
import { columnsRouter } from "#routers/columnsRouter";
import { pagesRouter } from "#routers/pagesRouter";
import type { inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
	greeting: publicProcedure.query(() => "Hello World!"),
	pages: pagesRouter,
	columns: columnsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
