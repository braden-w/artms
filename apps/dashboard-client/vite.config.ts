import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		react(),
		ViteImageOptimizer({}),
		imagetools(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:8787",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
