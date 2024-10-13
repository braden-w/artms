import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@repo/dashboard-server";

export const trpc = createTRPCReact<AppRouter>();
