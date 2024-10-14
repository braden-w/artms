import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/pages")({
	component: Pages,
});

function Pages() {
	return <div>Hello /pages!</div>;
}
