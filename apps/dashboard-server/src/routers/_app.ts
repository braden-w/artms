import { columnsRouter } from "./columnsRouter";
import { pagesRouter } from "./pagesRouter";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const appRouter = router({
	greet: publicProcedure.input(z.string().nullish()).query(({ input }) => {
		return `Hello ${input ?? "World"}!`;
	}),
	pages: pagesRouter,
	columns: columnsRouter,
});

export type AppRouter = typeof appRouter;
