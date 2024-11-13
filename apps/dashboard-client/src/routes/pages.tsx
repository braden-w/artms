import { createFileRoute, useSearch } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { searchSchema } from "@repo/dashboard-server/searchSchema";
import { trpc } from "@/utils/trpc";
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/pages")({
	component: Pages,
	validateSearch: zodSearchValidator(searchSchema),
});

function Pages() {
	const { filter, orderBy, limit, offset } = useSearch({
		from: "/pages",
	});

	const {
		data: { pageOfPages, allColumns } = { pageOfPages: [], allColumns: [] },
		isPending,
		error,
	} = trpc.pages.getPagesByWhereClause.useQuery({
		filter,
		orderBy,
		limit,
		offset,
	});

	return (
		<Fragment>
			<div>
				<h1>Pages</h1>
				<pre>{JSON.stringify({ filter, orderBy, limit, offset }, null, 2)}</pre>
			</div>
			<pre>{JSON.stringify({ pageOfPages, allColumns }, null, 2)}</pre>
		</Fragment>
	);
}
