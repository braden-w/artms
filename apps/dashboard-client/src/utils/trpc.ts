import { createTRPCReact } from "@trpc/react-query";
import type { Router } from "@repo/dashboard-server";

export const trpc = createTRPCReact<Router>();
