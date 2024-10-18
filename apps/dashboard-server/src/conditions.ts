import type { SQL } from "drizzle-orm";
import {
	and,
	eq,
	gt,
	gte,
	isNotNull,
	isNull,
	like,
	lt,
	lte,
	ne,
	not,
	or,
	sql,
} from "drizzle-orm";
import { z } from "zod";
import { pages, type Page } from "./db/schema/schema";

const isString = (value: unknown): value is string =>
	z.string().safeParse(value).success;

const isStringArray = (value: unknown): value is string[] =>
	z.array(z.string()).safeParse(value).success;

// Constants for comparison, non-comparison, and logical operators
export const comparisonOperators = [
	"==",
	"!=",
	">",
	"<",
	">=",
	"<=",
	"contains",
	"does not contain",
	"starts with",
	"ends with",
	"like",
	"is null",
	"is not null",
	"is empty",
	"is not empty",
] as const;

const logicalOperators = ["AND", "OR", "NOT"] as const;

// Types derived from constants
const logicalOperatorSchema = z.enum(logicalOperators);
type LogicalOperator = z.infer<typeof logicalOperatorSchema>;

export const primitiveValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
]);

// Union type for Condition
const conditionSchema = z.object({
	type: z.literal("condition"),
	columnName: z.string(),
	operator: z.enum(comparisonOperators),
	value: primitiveValueSchema,
});
type Condition = z.infer<typeof conditionSchema>;

type ConditionUntypedColumnName = Omit<Condition, "columnName"> & {
	columnName: string;
};

// Recursive definition for Filter
type LogicalGroup = {
	type: "logical";
	operator: LogicalOperator;
	conditions: Filter[];
};

// Union type for Filter
export type Filter = Condition | LogicalGroup;

type LogicalGroupUntypedColumnName = {
	type: "logical";
	operator: LogicalOperator;
	conditions: FilterUntypedColumnName[];
};

type FilterUntypedColumnName =
	| ConditionUntypedColumnName
	| LogicalGroupUntypedColumnName;

export const filterSchema: z.ZodType<
	Filter,
	z.ZodTypeDef,
	FilterUntypedColumnName
> = z.union([
	conditionSchema,
	z.object({
		type: z.literal("logical"),
		operator: z.enum(logicalOperators),
		conditions: z.array(z.lazy(() => filterSchema)),
	}),
]);

// Function to evaluate the filter (simplified for illustration)
function evaluateCondition(row: Page, condition: Condition): boolean {
	const { operator, value, columnName } = condition;
	if (!row.hasOwnProperty(columnName)) {
		throw new Error(`Column ${columnName} does not exist in the row`);
	}
	const currentValue = row[columnName as keyof Page];
	switch (operator) {
		case "==":
			return currentValue === value;
		case "!=":
			return currentValue !== value;
		case ">":
			return currentValue !== null && currentValue > value;
		case "<":
			return currentValue !== null && currentValue < value;
		case ">=":
			return currentValue !== null && currentValue >= value;
		case "<=":
			return currentValue !== null && currentValue <= value;
		case "contains":
			return isStringArray(currentValue) && currentValue.includes(value);
		case "does not contain":
			return isStringArray(currentValue) && !currentValue.includes(value);
		case "starts with":
			return typeof currentValue === "string" && currentValue.startsWith(value);
		case "ends with":
			return typeof currentValue === "string" && currentValue.endsWith(value);
		case "like":
			if (isString(currentValue) && isString(value)) {
				const regexPattern = value
					.replace(/%/g, ".*") // Replace '%' with '.*'
					.replace(/_/g, "."); // Replace '_' with '.'
				const regex = new RegExp(`^${regexPattern}$`, "i");
				return regex.test(currentValue);
			}
			return false;
		case "is null":
			return currentValue === null;
		case "is not null":
			return currentValue !== null;
		case "is empty":
			return (
				currentValue === null ||
				currentValue === "" ||
				(Array.isArray(currentValue) && currentValue.length === 0)
			);
		case "is not empty":
			return (
				currentValue === null ||
				currentValue !== "" ||
				(Array.isArray(currentValue) && currentValue.length === 0)
			);
		default:
			return false;
	}
}

export function evaluateFilter(row: Page, filter: Filter): boolean {
	switch (filter.type) {
		case "condition":
			return evaluateCondition(row, filter);
		case "logical": {
			const results = filter.conditions.map((cond) =>
				evaluateFilter(row, cond),
			);
			switch (filter.operator) {
				case "AND":
					return results.every((result) => result);
				case "OR":
					return results.some((result) => result);
				case "NOT":
					// TODO: Consider handling multiple conditions or removing NOT operator
					return !results[0];
				default:
					return false;
			}
		}
	}
}

export function buildWhereClause(filter: Filter): SQL | undefined {
	if (filter.type === "condition") return buildCondition(filter);
	if (filter.type === "logical") {
		const subClauses = filter.conditions.map(buildWhereClause);
		switch (filter.operator) {
			case "AND":
				return and(...subClauses);
			case "OR":
				return or(...subClauses);
			case "NOT":
				return not(subClauses[0]); // Assuming NOT operates on a single condition
		}
	}
	throw new Error("Invalid filter type");
}

function buildCondition(condition: Condition): SQL | undefined {
	const { columnName, operator, value } = condition;
	if (!pages.hasOwnProperty(columnName)) {
		throw new Error(`Column ${columnName} does not exist in the pages table`);
	}
	const currentValue = pages[columnName as keyof Page];
	switch (operator) {
		case "==":
			return eq(currentValue, value);
		case "!=":
			return ne(currentValue, value);
		case ">":
			return gt(currentValue, value);
		case ">=":
			return gte(currentValue, value);
		case "<":
			return lt(currentValue, value);
		case "<=":
			return lte(currentValue, value);
		case "contains":
			return sql`EXISTS (SELECT 1 FROM json_each(${currentValue}) WHERE value = ${value})`;
		case "does not contain":
			return sql`NOT EXISTS (SELECT 1 FROM json_each(${currentValue}) WHERE value = ${value})`;
		case "starts with":
			return like(currentValue, `${value}%`);
		case "ends with":
			return like(currentValue, `%${value}`);
		case "like":
			return like(currentValue, `%${value}%`);
		case "is null":
			return isNull(currentValue);
		case "is not null":
			return isNotNull(currentValue);
		case "is empty":
			return eq(currentValue, "");
		case "is not empty":
			return ne(currentValue, "");
		default:
			throw new Error("Invalid comparison operator");
	}
}
