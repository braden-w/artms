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
const comparisonOperatorSchema = z.enum(COMPARISON_OPERATORS);

const COMBINE_OPERATORS = ["AND", "OR"] as const;
const combineOperatorSchema = z.enum(COMBINE_OPERATORS);
type CombineOperator = z.infer<typeof combineOperatorSchema>;

type RuleOrGroup = Rule | Group;

const ruleSchema = z.object({
	type: z.literal("condition"),
	columnName: z.string(),
	operator: comparisonOperatorSchema,
	value: pagePropertyValueSchema,
});
type Rule = z.infer<typeof ruleSchema>;

const groupSchema: z.ZodType<Group> = z.lazy(() =>
	z.object({
		type: z.literal("group"),
		combinator: combineOperatorSchema,
		rulesOrGroups: z.array(z.union([ruleSchema, groupSchema])).nonempty(),
	}),
);
type Group = {
	type: "group";
	combinator: CombineOperator;
	rulesOrGroups: [RuleOrGroup, ...RuleOrGroup[]];
};

// Top level filter type
export type Filter = RuleOrGroup;
export const filterSchema = z.union([ruleSchema, groupSchema]);

export function evaluateFilter(row: SelectPage, filter: Filter): boolean {
	return evaluateRuleOrGroup(row, filter);
}

function evaluateRuleOrGroup(
	row: SelectPage,
	ruleOrGroup: RuleOrGroup,
): boolean {
	if (ruleOrGroup.type === "condition") {
		return evaluateRule(row, ruleOrGroup);
	}
	return evaluateGroup(row, ruleOrGroup);
}

function evaluateGroup(row: SelectPage, group: Group): boolean {
	const results = group.rulesOrGroups.map((ruleOrGroup) =>
		evaluateRuleOrGroup(row, ruleOrGroup),
	);

	switch (group.combinator) {
		case "AND":
			return results.every((result) => result);
		case "OR":
			return results.some((result) => result);
	}
}

function evaluateRule(row: SelectPage, rule: Rule): boolean {
	const { operator, value: targetValue, columnName } = rule;
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

export function filterToWhereClause(filter: Filter): SQL | undefined {
	return ruleOrGroupToWhereClause(filter);
}

function ruleOrGroupToWhereClause(ruleOrGroup: RuleOrGroup): SQL {
	if (ruleOrGroup.type === "condition") return ruleToWhereClause(ruleOrGroup);
	return groupToWhereClause(ruleOrGroup);
}

function groupToWhereClause(group: Group): SQL {
	const subClauses = group.rulesOrGroups.map(ruleOrGroupToWhereClause) as [
		SQL,
		...SQL[],
	];

	switch (group.combinator) {
		case "AND":
			return and(...subClauses) as SQL;
		case "OR":
			return or(...subClauses) as SQL;
		default:
			return and(...subClauses) as SQL;
	}
}

function ruleToWhereClause(condition: Rule): SQL {
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
