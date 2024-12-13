import { routeTree } from "@/routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../dashboard-server/src/routers/_app";
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient();

export const trpc = createTRPCReact<AppRouter>();

const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			url: "http://localhost:8787/trpc",
			transformer: superjson,
		}),
	],
});

export const clientUtils = createTRPCQueryUtils({
	queryClient,
	client: trpcClient,
});

export const createRouter = () =>
	createTanstackRouter({
		routeTree,
		Wrap: function WrapComponent({ children }) {
			return (
				<trpc.Provider client={trpcClient} queryClient={queryClient}>
					<QueryClientProvider client={queryClient}>
						<ThemeProvider defaultTheme="dark" storageKey="ui-theme">
							{children}
						</ThemeProvider>
					</QueryClientProvider>
				</trpc.Provider>
			);
		},
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
