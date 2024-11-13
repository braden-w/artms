import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { pagesRouter } from "./pagesRouter";
import { columnsRouter } from "./columnsRouter";

export const appRouter = router({
	greet: publicProcedure.input(z.string().nullish()).query(({ input }) => {
		return `Hello ${input ?? "World"}!`;
	}),
	pages: pagesRouter,
	columns: columnsRouter,
});
