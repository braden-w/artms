import { filterSchema } from "#conditions";
import { z } from "zod";

export const searchSchema = z.object({
	filter: filterSchema.optional().default({
		type: "rule",
		columnName: "title",
		operator: "like",
		value: "",
	}),
	orderBy: z.string().optional().default(""),
	limit: z.number().optional().default(10),
	offset: z.number().optional().default(0),
});

export type Search = z.infer<typeof searchSchema>;
