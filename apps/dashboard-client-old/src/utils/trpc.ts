import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@repo/dashboard-server/_app";

export const trpc = createTRPCReact<AppRouter>();
