import { columnSchema } from "#db/schema/columns";
import { protectedProcedure, router } from "#trpc";

export const columnsRouter = router({
	getAllColumns: protectedProcedure.query(({ ctx }) =>
		ctx.services.columns.getAllColumns(),
	),
	setColumn: protectedProcedure
		.input(columnSchema)
		.mutation(({ ctx, input }) => ctx.services.columns.setColumnByName(input)),
});
