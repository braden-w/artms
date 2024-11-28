import { filterSchema } from "#conditions";
import { z } from "zod";

export const searchSchema = z.object({
	filter: filterSchema.optional().default({
		type: "rule",
		propertyName: "title",
		operator: "like",
		value: "",
	}),
	orderBy: z.string().optional().default(""),
	limit: z.coerce.number().int().positive().optional().default(10),
	offset: z.coerce.number().int().min(0).optional().default(0),
});

export type Search = z.infer<typeof searchSchema>;
