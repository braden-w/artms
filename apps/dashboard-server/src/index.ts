import { appRouter } from "#routers/_app";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

const FRONTEND_ORIGIN = "http://localhost:5173";
app.use(cors({ origin: FRONTEND_ORIGIN }));

app.use("*", logger());

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
	}),
);

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default app;
