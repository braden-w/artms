import logoImage from "@/assets/logo.jpeg?w=64&h=64";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import type { trpcQueryUtils } from "@/router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const NAME = "braden";

export const Route = createRootRouteWithContext<{
	trpcQueryUtils: typeof trpcQueryUtils;
}>()({
	component: () => (
		<>
			<div className="flex min-h-screen flex-col">
				<header className="justify-between mx-4 mb-6 flex h-16 items-center gap-4 py-1.5 lg:mx-6 lg:mb-16">
					<a className="group flex items-center gap-4" href="/">
						<Button
							variant="ghost"
							size="icon"
							className="text-xl font-bold transition duration-300 group-hover:-translate-x-1"
						>
							<img className="rounded" src={logoImage} alt="Epicenter Logo" />
							<span className="sr-only">Epicenter</span>
						</Button>
						<span> /</span>
						<Button
							variant="ghost"
							className="-ml-1.5 px-1.5 text-xl transition duration-300 group-hover:translate-x-1"
						>
							{NAME}
						</Button>
					</a>
					<ModeToggle />
				</header>

				<main className="container flex-1 bg-background/80">
					<Outlet />
				</main>
			</div>
			<ReactQueryDevtools />
			<TanStackRouterDevtools />
		</>
	),
});
