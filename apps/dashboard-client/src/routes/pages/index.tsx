import { clientUtils } from "@/router";
import { searchSchema } from "@repo/dashboard-server/searchSchema";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { Fragment } from "react/jsx-runtime";
import { DataTable } from "./-components/DataTable";

export const Route = createFileRoute("/pages/")({
	component: Pages,
	validateSearch: zodSearchValidator(searchSchema),
	loaderDeps: ({ search }) => ({
		filter: search.filter,
		orderBy: search.orderBy,
		limit: search.limit,
		offset: search.offset,
	}),
	loader: async ({ deps }) =>
		clientUtils.pages.getPagesByWhereClause.ensureData({
			filter: deps.filter,
			orderBy: deps.orderBy,
			limit: deps.limit,
			offset: deps.offset,
		}),
});

function Pages() {
	return (
		<Fragment>
			<div>
				<h1>Pages</h1>
			</div>
			<DataTable />
		</Fragment>
	);
}
