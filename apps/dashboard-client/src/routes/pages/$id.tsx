import { createFileRoute } from "@tanstack/react-router";
import { PageEditor } from "./-components/PageEditor";

export const Route = createFileRoute("/pages/$id")({
	component: Page,
	loader: async ({ params: { id }, context: { trpcQueryUtils } }) => {
		await Promise.all([
			trpcQueryUtils.pages.getPageById.ensureData({ id }),
			trpcQueryUtils.columns.getAllColumns.ensureData(undefined),
		]);
	},
});

function Page() {
	const { id } = Route.useParams();
	return <PageEditor id={id} />;
}
