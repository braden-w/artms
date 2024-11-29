import { filterToWhereClause } from "#conditions";
import { COLUMNS_IN_DATABASE } from "#db/COLUMNS_IN_DATABASE";
import { selectPageSchema } from "#db/schema/pages";
import { searchSchema } from "#searchSchema";
import { protectedProcedure, router } from "#trpc";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const pagesRouter = router({
	getAllPages: protectedProcedure.query(({ ctx }) =>
		ctx.services.pages.getAllPages(),
	),

	getPageById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input: { id } }) => ctx.services.pages.getPageById(id)),

	replacePage: protectedProcedure
		.input(selectPageSchema)
		.mutation(({ ctx, input }) => ctx.services.pages.replacePage(input)),

	addPage: protectedProcedure
		.input(selectPageSchema)
		.mutation(({ ctx, input }) => ctx.services.pages.addPage(input)),

	deletePageById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) => ctx.services.pages.deletePageById(input.id)),

	getPagesByWhereClause: protectedProcedure
		.input(searchSchema)
		.query(async ({ ctx, input: { filter, orderBy, limit, offset } }) => {
			// TODO: get most recent columns instead of static COLUMNS_IN_DATABASE
			const [
				pageOfPages,
				// allColumns,
			] = await ctx.db.batch([
				ctx.db.query.pagesTable.findMany({
					where: filterToWhereClause(filter),
					orderBy: orderBy ? sql.raw(orderBy) : undefined,
					limit: limit,
					offset: offset,
				}),
				// ctx.services.columns.getAllColumns(),
			]);
			const allColumns = COLUMNS_IN_DATABASE;
			return {
				pageOfPages,
				allColumns: allColumns as typeof COLUMNS_IN_DATABASE,
			};
		}),

	getPagesByFts: protectedProcedure
		.input(
			z.object({
				query: z.string().refine((s) => s.length > 0),
				limit: z.number().optional().default(10),
				offset: z.number().optional().default(0),
			}),
		)
		.query(({ ctx, input }) => ctx.services.pages.getPagesByFts(input)),
});
