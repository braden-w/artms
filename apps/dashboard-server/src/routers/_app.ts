import { router } from "../trpc";
import { columnsRouter } from "./columnsRouter";
import { pagesRouter } from "./pagesRouter";

export const appRouter = router({
	pages: pagesRouter,
	columns: columnsRouter,
});

export type AppRouter = typeof appRouter;
