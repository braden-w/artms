import {
	type SelectPage,
	pagePropertyValueSchema,
	pagesTable,
} from "#db/schema/pages";
import { isString, isStringArray } from "#utils";
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
	or,
	sql,
} from "drizzle-orm";
import { z } from "zod";

// Constants for comparison, non-comparison, and group operators
export const COMPARISON_OPERATORS = [
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

const COMBINE_OPERATORS = ["AND", "OR"] as const;

const combineOperatorSchema = z.enum(COMBINE_OPERATORS);
type CombineOperator = z.infer<typeof combineOperatorSchema>;

const filterConditionSchema = z.object({
	type: z.literal("condition"),
	columnName: z.string(),
	operator: z.enum(COMPARISON_OPERATORS),
	value: pagePropertyValueSchema,
});

type FilterCondition = z.infer<typeof filterConditionSchema>;

type FilterGroup = {
	type: "group";
	combinator: CombineOperator;
	conditions: (FilterCondition | FilterGroup)[];
};

export const filterGroupSchema: z.ZodType<FilterGroup> = z.lazy(() =>
	z.object({
		type: z.literal("group"),
		combinator: combineOperatorSchema,
		conditions: z.array(z.union([filterConditionSchema, filterGroupSchema])),
	}),
);

function evaluateCondition(
	row: SelectPage,
	condition: FilterCondition,
): boolean {
	const { operator, value: targetValue, columnName } = condition;
	if (!(columnName in row)) {
		throw new Error(`Column ${columnName} does not exist in the row`);
	}
	const currentValue = row[columnName as keyof SelectPage];
	// currentValue [operator] targetValue
	switch (operator) {
		case "==":
			return currentValue === targetValue;
		case "!=":
			return currentValue !== targetValue;
		case ">":
			if (currentValue === null || targetValue === null) return false;
			return currentValue > targetValue;
		case "<":
			if (currentValue === null || targetValue === null) return false;
			return currentValue < targetValue;
		case ">=":
			if (currentValue === null || targetValue === null) return false;
			return currentValue >= targetValue;
		case "<=":
			if (currentValue === null || targetValue === null) return false;
			return currentValue <= targetValue;
		case "contains":
			if (currentValue === null || targetValue === null) return false;
			if (!isStringArray(currentValue) || !isStringArray(targetValue)) {
				return false;
			}
			return targetValue.every((value) => currentValue.includes(value));
		case "does not contain":
			if (currentValue === null || targetValue === null) return false;
			if (!isStringArray(currentValue) || !isStringArray(targetValue)) {
				return false;
			}
			return targetValue.every((value) => !currentValue.includes(value));
		case "starts with":
			if (currentValue === null || targetValue === null) return false;
			if (!isString(currentValue) || !isString(targetValue)) return false;
			return currentValue.startsWith(targetValue);
		case "ends with":
			if (currentValue === null || targetValue === null) return false;
			if (!isString(currentValue) || !isString(targetValue)) return false;
			return currentValue.endsWith(targetValue);
		case "like": {
			if (!isString(currentValue) || !isString(targetValue)) return false;
			const regexPattern = targetValue
				.replace(/%/g, ".*") // Replace '%' with '.*'
				.replace(/_/g, "."); // Replace '_' with '.'
			const regex = new RegExp(`^${regexPattern}$`, "i");
			return regex.test(currentValue);
		}
		case "is null":
			return currentValue === null;
		case "is not null":
			return currentValue !== null;
		case "is empty": {
			if (currentValue === null) return true;
			if (isString(currentValue) && currentValue === "") return true;
			if (isStringArray(currentValue) && currentValue.length === 0) return true;
			return false;
		}
		case "is not empty": {
			if (currentValue === null) return false;
			if (isString(currentValue) && currentValue === "") return false;
			if (isStringArray(currentValue) && currentValue.length === 0)
				return false;
			return true;
		}
		default:
			return false;
	}
}

export function evaluateFilter(row: SelectPage, filter: Filter): boolean {
	switch (filter.type) {
		case "condition":
			return evaluateCondition(row, filter);
		case "group": {
			const results = filter.conditions.map((cond) =>
				evaluateFilter(row, cond),
			);
			switch (filter.operator) {
				case "AND":
					return results.every((result) => result);
				case "OR":
					return results.some((result) => result);
				default:
					return false;
			}
		}
	}
}

export function buildWhereClause(filter: Filter): SQL | undefined {
	if (filter.type === "condition") return buildCondition(filter);
	if (filter.type === "group") {
		const subClauses = filter.conditions.map(buildWhereClause);
		switch (filter.operator) {
			case "AND":
				return and(...subClauses);
			case "OR":
				return or(...subClauses);
		}
	}
	throw new Error("Invalid filter type");
}

function buildCondition(condition: FilterCondition): SQL | undefined {
	const { columnName, operator, value } = condition;
	if (!(columnName in pagesTable)) {
		throw new Error(`Column ${columnName} does not exist in the pages table`);
	}
	const currentValue = pagesTable[columnName as keyof SelectPage];
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
