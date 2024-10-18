import { createFileRoute, useSearch } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { searchSchema } from "@repo/dashboard-server/searchSchema";

export const Route = createFileRoute("/pages")({
	component: Pages,
	validateSearch: zodSearchValidator(searchSchema),
});

function Pages() {
	const { filter, orderBy, limit, offset } = useSearch({
		from: "/pages",
	});

	return (
		<div>
			<h1>Pages</h1>
			<pre>{JSON.stringify({ filter, orderBy, limit, offset }, null, 2)}</pre>
		</div>
	);
}
