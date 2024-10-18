import { createFileRoute, useSearch } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

const searchSchema = z.object({
	filter: z
		.object({
			type: z.literal("condition"),
			columnName: z.string(),
			operator: z.string(),
			value: z.string(),
		})
		.optional(),
	orderBy: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

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
