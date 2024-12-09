import { generateDefaultPage } from "@/actions/generateDefaultPage";
import { PageEditorDialog } from "@/components/PageEditor";
import { RenderValue } from "@/components/RenderValue";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { trpc } from "@/utils/trpc";
import type { Column, Page } from "@repo/dashboard-server/schema";
import {
	comparisonOperators,
	evaluateFilter,
} from "@repo/dashboard-server/conditions";
import { useNavigate } from "@tanstack/react-router";
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Route } from "..";

const DEBOUNCE_DELAY_MS = 300;

export function DataTable() {
	const { filter, orderBy, limit, offset } = Route.useSearch();
	const navigate = useNavigate();

	const {
		data: { pageOfPages, allColumns } = { pageOfPages: [], allColumns: [] },
		isPending: isPagesPending,
		error: pagesError,
	} = trpc.pages.getPagesByWhereClause.useQuery({
		filter,
		orderBy,
		limit,
		offset,
	});

	const utils = trpc.useUtils();

	const { mutate: updatePage, isPending: isUpdatePending } =
		trpc.pages.setPage.useMutation({
			onMutate: async (newPage) => {
				await utils.pages.getPagesByWhereClause.cancel();
				const prevPages = utils.pages.getPagesByWhereClause.getData({
					filter,
					orderBy,
					limit,
					offset,
				});
				utils.pages.getPagesByWhereClause.setData(
					{ filter, orderBy, limit, offset },
					(oldPageOfPages) => {
						if (!oldPageOfPages) return;
						return {
							pageOfPages: oldPageOfPages.pageOfPages.map((p) =>
								p.id === newPage.id ? newPage : p,
							),
							allColumns: oldPageOfPages.allColumns,
						};
					},
				);
				return { prevPages };
			},
			onError: (err, newPage, context) => {
				if (!context) return;
				utils.pages.getPagesByWhereClause.setData(
					{ filter, orderBy, limit, offset },
					context.prevPages,
				);
			},
			onSettled: () => {
				utils.pages.getPagesByWhereClause.invalidate({
					filter,
					orderBy,
					limit,
					offset,
				});
			},
			onSuccess: () => {
				toast.success("Saved", {
					description: "Your changes have been saved.",
				});
			},
		});

	const { mutate: insertPage, isPending: isInsertPending } =
		trpc.pages.insertPage.useMutation({
			onMutate: async (newPage) => {
				await utils.pages.getPagesByWhereClause.cancel();
				const prevPages = utils.pages.getPagesByWhereClause.getData({
					filter,
					orderBy,
					limit,
					offset,
				});
				utils.pages.getPagesByWhereClause.setData(
					{ filter, orderBy, limit, offset },
					(oldPageOfPages) => {
						if (!oldPageOfPages) return;
						return {
							pageOfPages: [...oldPageOfPages.pageOfPages, newPage],
							allColumns: oldPageOfPages.allColumns,
						};
					},
				);
				return { prevPages };
			},
			onError: (err, newPage, context) => {
				if (!context) return;
				utils.pages.getPagesByWhereClause.setData(
					{ filter, orderBy, limit, offset },
					context.prevPages,
				);
			},
			onSettled: () => {
				utils.pages.getPagesByWhereClause.invalidate({
					filter,
					orderBy,
					limit,
					offset,
				});
			},
			onSuccess: () => {
				toast.success("Saved", {
					description: "Your changes have been saved.",
				});
			},
		});

	const { mutate: deletePage, isPending: isDeletePending } =
		trpc.pages.deletePageById.useMutation({
			onMutate: async ({ id }) => {
				await utils.pages.getPagesByWhereClause.cancel();
				const prevPages = utils.pages.getPagesByWhereClause.getData({
					filter,
					orderBy,
					limit,
					offset,
				});
				utils.pages.getPagesByWhereClause.setData(
					{ filter, orderBy, limit, offset },
					(oldPageOfPages) => {
						if (!oldPageOfPages) return;
						return {
							pageOfPages: oldPageOfPages.pageOfPages.filter(
								(p) => p.id !== id,
							),
							allColumns: oldPageOfPages.allColumns,
						};
					},
				);
				return { prevPages };
			},
			onError: (err, { id }, context) => {
				if (!context) return;
				utils.pages.getPagesByWhereClause.setData(
					{ filter, orderBy, limit, offset },
					context.prevPages,
				);
			},
			onSettled: () => {
				utils.pages.getPagesByWhereClause.invalidate({
					filter,
					orderBy,
					limit,
					offset,
				});
			},
			onSuccess: () => {
				toast.success("Saved", {
					description: "Your changes have been saved.",
				});
			},
		});

	const {
		data: columnsInDb = [],
		isPending: isColumnsPending,
		isError: isColumnsError,
		error: columnsError,
	} = trpc.columns.getAllColumns.useQuery();

	const columnDefs: ColumnDef<Page>[] = [
		{
			id: "__actions",
			accessorKey: "id",
			header: "actions",
			cell: ({ getValue, row }) => {
				const pageId = getValue<string>();
				const {
					page,
					saveStatus,
					setPageSaveDbDebounce,
					setPageSaveDbImmediate,
				} = usePage(pageId, { enabled: false });
				return (
					<div className="flex items-center justify-center gap-1">
						<PageEditorDialog
							page={page}
							setPageSaveDbDebounce={setPageSaveDbDebounce}
							setPageSaveDbImmediate={setPageSaveDbImmediate}
							columns={columnsInDb}
							saveStatus={saveStatus}
							onBlur={() => setPageInPagesWithRerender(page)}
						/>
						<a
							href={`/pages/${pageId}`}
							className={buttonVariants({
								variant: "ghost",
								size: "icon",
							})}
						>
							<PlusIcon />
						</a>
						<Button
							variant="ghost"
							size="icon"
							onClick={async () => {
								deletePage(page.id);
								toast.success("Success", { description: "Row deleted!" });
							}}
						>
							<TrashIcon />
						</Button>
					</div>
				);
			},
		},
		...columnsInDb.map(
			(column) =>
				({
					id: column.name,
					accessorKey: "id",
					header: column.name,
					meta: { column },
					cell: ({ getValue }) => {
						const pageId = getValue<string>();
						const { page, saveStatus, setPageSaveDbDebounce } = usePage(
							pageId,
							{ enabled: false },
						);
						return (
							<RenderValue
								key={`${pageId}-${column.name}`}
								value={page[column.name as keyof Page] ?? ""}
								column={column}
								isDisabled={
									!(!column.filter || evaluateFilter(page, column.filter))
								}
								saveStatus={saveStatus}
								onChange={(newValue) => {
									setPageSaveDbDebounce((page) => ({
										...page,
										[column.name]: newValue,
									}));
								}}
								onBlur={() => setPageInPagesWithRerender(page)}
								page={page}
							/>
						);
					},
				}) satisfies ColumnDef<Page>,
		),
	];

	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		calculateColumnVisibility({ columns: columnsInDb, pages }),
	);

	const table = useReactTable({
		data: pageOfPages,
		columns: columnDefs,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		autoResetPageIndex,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
		getRowId: (row) => {
			return row.id;
		},
	});

	if (filter.type !== "condition") {
		throw new Error("Filter must be a condition");
	}

	if (isPagesPending) return <p>Loading...</p>;
	if (isPagesError) return <p>Error: {JSON.stringify(pagesError)}</p>;

	const setPageInPagesWithRerender = (updatedPage: Page) => {
		skipAutoResetPageIndex();
		updatePage(updatedPage);
		setColumnVisibility(
			calculateColumnVisibility({ columns: columnsInDb, pages }),
		);
	};

	return (
		<div className="p-4 flex flex-col justify-center gap-2">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					return refetchPages();
				}}
				className="flex gap-2 items-center"
			>
				<Label htmlFor="columnName" className="sr-only">
					Column Name
				</Label>
				<Select
					name="columnName"
					defaultValue={filter.columnName}
					value={filter.columnName}
					onValueChange={(value) => setFilter({ ...filter, columnName: value })}
				>
					<SelectTrigger className="w-[280px]">
						<SelectValue id="columnName" placeholder="Select a column..." />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{columnNames.map((column) => (
								<SelectItem key={column} value={column}>
									{column}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Label htmlFor="operator" className="sr-only">
					Operator
				</Label>
				<Select
					name="operator"
					defaultValue={filter.operator}
					value={filter.operator}
					onValueChange={(value) => setFilter({ ...filter, operator: value })}
				>
					<SelectTrigger className="w-[280px]">
						<SelectValue id="operator" placeholder="Operator" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{comparisonOperators.map((operator) => (
								<SelectItem key={operator} value={operator}>
									{operator}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Label htmlFor="value" className="sr-only">
					Value
				</Label>
				<Input
					id="value"
					name="value"
					type="text"
					placeholder="Value..."
					value={filter.value}
					onChange={(e) => setFilter({ ...filter, value: e.target.value })}
				/>

				<Label htmlFor="orderBy" className="sr-only">
					Order By
				</Label>
				<Input
					id="orderBy"
					name="orderBy"
					type="text"
					placeholder="Order By..."
					value={orderBy}
					onChange={(e) => setOrderBy(e.target.value)}
				/>

				<Label htmlFor="limit">Limit</Label>
				<Input
					id="limit"
					name="limit"
					type="number"
					placeholder="Limit"
					value={limit}
					onChange={(e) => setLimit(Number.parseInt(e.target.value, 10))}
				/>

				<Label htmlFor="offset">Offset</Label>
				<Input
					id="offset"
					name="offset"
					type="number"
					placeholder="Offset"
					value={offset}
					onChange={(e) => setOffset(Number.parseInt(e.target.value, 10))}
				/>
				<Button type="submit" className="h-10">
					Submit
				</Button>
			</form>
			<div className="flex h-full w-full flex-col gap-2">
				<div className="flex h-full w-full flex-col gap-2">
					<div className="flex gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="ml-auto">
									Columns
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id.replaceAll("_", " ")}
										</DropdownMenuCheckboxItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							onClick={async () => {
								const newPage = generateDefaultPage();
								insertPage(newPage);
								toast.success("Success", { description: "Row added!" });
							}}
						>
							<PlusIcon className="mr-2 h-4 w-4" />
							Add
						</Button>
						<Button
							onClick={async () => {
								const newPage = generateDefaultPage();
								await actions.pages.insertPage.orThrow(newPage);
								toast.success("Success", { description: "Row added!" });
								navigate(`/pages/${newPage.id}`);
							}}
						>
							<PlusIcon className="mr-2 h-4 w-4" />
							Add And Open
						</Button>
					</div>
					<div className="relative overflow-auto rounded-md border">
						<Table className="border-collapse">
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows.length !== 0 ? (
									table.getRowModel().rows.map((row) => (
										<TableRow key={row.id} className="divide-x">
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id} className="p-0 max-w-xs">
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columnsInDb.length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}

function calculateColumnVisibility({
	columns,
	pages,
}: {
	columns: Column[];
	pages: Page[];
}) {
	const columnVisibility: VisibilityState = {};
	for (const { name: columnName, filter } of columns) {
		const isColumnShouldBeVisible =
			!filter || pages.some((page) => evaluateFilter(page, filter));
		columnVisibility[columnName] = isColumnShouldBeVisible;
	}
	return columnVisibility;
}

function useSkipper() {
	const shouldSkipRef = useRef(true);
	const shouldSkip = shouldSkipRef.current;

	// Wrap a function with this to skip a pagination reset temporarily
	const skip = () => {
		shouldSkipRef.current = false;
	};

	useEffect(() => {
		shouldSkipRef.current = true;
	});

	return [shouldSkip, skip] as const;
}

function useCustomDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			if (JSON.stringify(value) !== JSON.stringify(debouncedValue)) {
				setDebouncedValue(value);
			}
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay, debouncedValue]);

	return debouncedValue;
}
