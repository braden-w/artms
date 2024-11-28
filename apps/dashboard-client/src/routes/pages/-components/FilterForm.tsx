"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { COMPARISON_OPERATORS } from "@repo/dashboard-server/conditions";
import type { Column } from "@repo/dashboard-server/schema";
import { useNavigate } from "@tanstack/react-router";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import {
	searchSchema,
	type FilterGroup,
	type FilterRule,
} from "@repo/dashboard-server/searchSchema";

export function FilterForm({
	allColumns,
	defaultValues,
}: {
	allColumns: Column[];
	defaultValues: z.infer<typeof searchSchema>;
}) {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof searchSchema>>({
		resolver: zodResolver(searchSchema),
		defaultValues,
	});

	function handleSubmit(values: z.infer<typeof searchSchema>) {
		navigate({
			to: "/pages",
			params: values,
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<FilterGroupComponent control={form.control} allColumns={allColumns} />

				<div className="flex gap-4">
					<FormField
						control={form.control}
						name="orderBy"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Order By</FormLabel>
								<FormControl>
									<Input placeholder="Order By..." {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="limit"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Limit</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Limit"
										{...field}
										onChange={(e) => field.onChange(e.target.valueAsNumber)}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="offset"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Offset</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Offset"
										{...field}
										onChange={(e) => field.onChange(e.target.valueAsNumber)}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit">Apply Filters</Button>
			</form>
		</Form>
	);
}

function FilterRuleComponent({
	index,
	nestIndex,
	control,
	allColumns,
}: {
	index: number;
	nestIndex?: number;
	control: any;
	allColumns: Column[];
}) {
	const fieldName =
		nestIndex !== undefined
			? `filter.rules.${nestIndex}.rules.${index}`
			: `filter.rules.${index}`;

	return (
		<div className="flex gap-2 items-center">
			<FormField
				control={control}
				name={`${fieldName}.propertyName`}
				render={({ field }) => (
					<FormItem>
						<Select value={field.value} onValueChange={field.onChange}>
							<FormControl>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Select column..." />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectGroup>
									{allColumns.map((column) => (
										<SelectItem key={column.name} value={column.name}>
											{column.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name={`${fieldName}.operator`}
				render={({ field }) => (
					<FormItem>
						<Select value={field.value} onValueChange={field.onChange}>
							<FormControl>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Select operator..." />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectGroup>
									{COMPARISON_OPERATORS.map((operator) => (
										<SelectItem key={operator} value={operator}>
											{operator}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name={`${fieldName}.value`}
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Input placeholder="Value..." {...field} className="w-[200px]" />
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
}

function FilterGroupComponent({
	nestIndex,
	control,
	allColumns,
}: {
	nestIndex?: number;
	control: any;
	allColumns: Column[];
}) {
	const { fields, append, remove } = useFieldArray({
		control,
		name:
			nestIndex !== undefined
				? `filter.rules.${nestIndex}.rules`
				: "filter.rules",
	});

	return (
		<div className="space-y-4 border rounded-lg p-4">
			<FormField
				control={control}
				name={
					nestIndex !== undefined
						? `filter.rules.${nestIndex}.combinator`
						: "filter.combinator"
				}
				render={({ field }) => (
					<FormItem>
						<Select value={field.value} onValueChange={field.onChange}>
							<FormControl>
								<SelectTrigger className="w-[100px]">
									<SelectValue />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="AND">AND</SelectItem>
								<SelectItem value="OR">OR</SelectItem>
							</SelectContent>
						</Select>
					</FormItem>
				)}
			/>

			<div className="space-y-4 ml-6">
				{fields.map((field, index) => (
					<div key={field.id} className="flex gap-2 items-start">
						{field.type === "rule" ? (
							<FilterRuleComponent
								index={index}
								nestIndex={nestIndex}
								control={control}
								allColumns={allColumns}
							/>
						) : (
							<FilterGroupComponent
								nestIndex={index}
								control={control}
								allColumns={allColumns}
							/>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => remove(index)}
							className="mt-1"
						>
							✕
						</Button>
					</div>
				))}
			</div>

			<div className="flex gap-2 ml-6">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() =>
						append({
							type: "rule",
							propertyName: "",
							operator: "like",
							value: "",
						})
					}
				>
					Add Rule
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() =>
						append({
							type: "group",
							combinator: "AND",
							rules: [],
						})
					}
				>
					Add Group
				</Button>
			</div>
		</div>
	);
}
