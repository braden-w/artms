import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pages/$id")({
	component: Page,
	loader: async ({ params: { id }, context: { trpcQueryUtils } }) => {
		await trpcQueryUtils.pages.getPageById.ensureData({ id });
	},
});

function Page() {
	const { id } = Route.useParams();
	return (
		<main className="container max-w-7xl">{/* <PageEditor id={id} /> */}</main>
	);
}
