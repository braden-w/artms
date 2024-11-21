import { protectedProcedure, router } from "@/trpc";

export const columnsRouter = router({
	getAllColumns: protectedProcedure.query(({ ctx }) =>
		ctx.services.columns.getAllColumns(),
	),
});
