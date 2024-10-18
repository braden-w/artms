import { filterSchema } from "./conditions";
import { z } from "zod";

export const searchSchema = z.object({
	filter: filterSchema,
	orderBy: z.string(),
	limit: z.number(),
	offset: z.number(),
});

export type Search = z.infer<typeof searchSchema>;
