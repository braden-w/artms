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
import { zodResolver } from "@hookform/resolvers/zod";
import type { Column } from "@repo/dashboard-server/schema";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { searchSchema } from "@repo/dashboard-server/searchSchema";
import { RenderGroup } from "./RenderGroup";

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
			search: values,
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<RenderGroup control={form.control} allColumns={allColumns} />

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
