import { buildWhereClause } from "../conditions";
import { selectPageSchema } from "../db/schema/pages";
import { searchSchema } from "../searchSchema";
import { protectedProcedure, router } from "../trpc";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const pagesRouter = router({
	getAllPages: protectedProcedure.query(({ ctx }) =>
		ctx.services.pages.getAllPages(),
	),

	setPage: protectedProcedure
		.input(selectPageSchema)
		.mutation(({ ctx, input }) => ctx.services.pages.setPage(input)),

	insertPage: protectedProcedure
		.input(selectPageSchema)
		.mutation(({ ctx, input }) => ctx.services.pages.insertPage(input)),

	deletePageById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) => ctx.services.pages.deletePageById(input.id)),

	getPagesByWhereClause: protectedProcedure
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
				ctx.services.columns.getAllColumns(),
			]);
			return { pageOfPages, allColumns };
		}),
});
