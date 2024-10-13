import { z } from "zod";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
	greet: publicProcedure.input(z.string().nullish()).query(({ input }) => {
		return `Hello ${input ?? "World"}!`;
	}),
});
