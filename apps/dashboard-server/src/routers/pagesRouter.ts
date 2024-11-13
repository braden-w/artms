import { sql } from "drizzle-orm";
import { buildWhereClause } from "../conditions";
import { searchSchema } from "../searchSchema";
import { protectedProcedure, router } from "../trpc";

export const pagesRouter = router({
	getPagesByWhereClauseWithColumns: protectedProcedure
		.input(searchSchema)
		.query(async ({ input, ctx }) => {
			const { filter, orderBy, limit, offset } = input;
			const [pageOfPages, allColumns] = await ctx.db.batch([
				ctx.db.query.pagesTable.findMany({
					where: buildWhereClause(filter),
					orderBy: orderBy ? sql.raw(orderBy) : undefined,
					limit: limit,
					offset: offset,
				}),
				ctx.getAllColumns(),
			]);
			return { pageOfPages, allColumns };
		}),
});
