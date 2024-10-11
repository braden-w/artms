import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { trpc } from "./utils/trpc";
import viteLogo from "/vite.svg";

function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				// httpBatchLink({
				// 	url: "http://localhost:3000/trpc",
				// 	// You can pass any HTTP headers you wish here
				// 	async headers() {
				//     return {
				//       authorization: getAuthCookie(),
				//     };
				//   },
				// }),
			],
		}),
	);

	const [count, setCount] = useState(0);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<div>
					<a href="https://vitejs.dev" target="_blank">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank">
						<img src={reactLogo} className="logo react" alt="React logo" />
					</a>
				</div>
				<h1>Vite + React</h1>
				<div className="card">
					<button onClick={() => setCount((count) => count + 1)}>
						count is {count}
					</button>
					<p>
						Edit <code>src/App.tsx</code> and save to test HMR
					</p>
				</div>
				<p className="read-the-docs">
					Click on the Vite and React logos to learn more
				</p>
			</QueryClientProvider>
		</trpc.Provider>
	);
}

export default App;
