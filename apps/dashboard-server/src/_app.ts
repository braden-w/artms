import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { searchSchema } from "./searchSchema";
import { buildWhereClause } from "./conditions";
import { sql } from "drizzle-orm";

export const appRouter = router({
	greet: publicProcedure.input(z.string().nullish()).query(({ input }) => {
		return `Hello ${input ?? "World"}!`;
	}),

	getPagesByWhereClauseWithColumns: protectedProcedure
		.input(searchSchema)
		.query(async ({ input, ctx }) => {
			const { filter, orderBy, limit, offset } = input;
			const where = buildWhereClause(filter);
			const pageOfPages = await ctx.db.query.pagesTable.findMany({
				where,
				orderBy: orderBy ? sql.raw(orderBy) : undefined,
				limit: limit,
				offset: offset,
			});
			const columnsInDb = await getAllColumnsInDb();
			await syncOptions({ columnsInDb, pages: pageOfPages });
			return { pageOfPages, columnsInDb };
		}),
});
