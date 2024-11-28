import { publicProcedure, router } from "#trpc";
import { columnsRouter } from "#routers/columnsRouter";
import { pagesRouter } from "#routers/pagesRouter";

export const appRouter = router({
	greeting: publicProcedure.query(() => "Hello World!"),
	pages: pagesRouter,
	columns: columnsRouter,
});

export type AppRouter = typeof appRouter;
