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
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { searchSchema } from "@repo/dashboard-server/searchSchema";

export function FilterForm({
	allColumns,
	defaultValues,
	onSubmit,
}: {
	allColumns: Column[];
	defaultValues: z.infer<typeof searchSchema>;
	onSubmit: () => void;
}) {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof searchSchema>>({
		resolver: zodResolver(searchSchema),
		defaultValues,
	});

	function handleSubmit({
		filter,
		orderBy,
		limit,
		offset,
	}: z.infer<typeof searchSchema>) {
		navigate({
			to: "/pages",
			params: {
				filter,
				orderBy,
				limit,
				offset,
			},
		});
		onSubmit();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex gap-2 items-center"
			>
				<FormField
					control={form.control}
					name="columnName"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="sr-only">Column Name</FormLabel>
							<Select value={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger className="w-[280px]">
										<SelectValue placeholder="Select a column..." />
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
					control={form.control}
					name="operator"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="sr-only">Operator</FormLabel>
							<Select value={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger className="w-[280px]">
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
					control={form.control}
					name="value"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="sr-only">Value</FormLabel>
							<FormControl>
								<Input placeholder="Value..." {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="orderBy"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="sr-only">Order By</FormLabel>
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
							<FormLabel className="sr-only">Limit</FormLabel>
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
							<FormLabel className="sr-only">Offset</FormLabel>
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

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
