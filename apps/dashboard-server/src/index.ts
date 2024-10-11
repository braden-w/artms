import { trpc } from "@elysiajs/trpc";
import { initTRPC } from "@trpc/server";
import { Elysia } from "elysia";
import { z } from "zod";

const t = initTRPC.create();
const p = t.procedure;

const router = t.router({
	greet: p.input(z.string()).query(({ input }) => "Hello Elysia"),
});

export type Router = typeof router;

const app = new Elysia({
	prefix: "/api",
})
	.use(trpc(router))
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
