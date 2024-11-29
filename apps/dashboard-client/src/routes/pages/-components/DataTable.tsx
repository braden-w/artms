import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { trpc, trpcClient } from "@/router";
import { evaluateFilter } from "@repo/dashboard-server/conditions";
import type { Column, SelectPage } from "@repo/dashboard-server/schema";
import { generateDefaultPage, isString } from "@repo/dashboard-server/utils";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
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
import { Loader2, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Route } from "..";
import { FilterForm } from "./FilterForm";
import { RenderValueAsCell } from "./RenderValue";

export function DataTable() {
	const initialData = useLoaderData({ from: "/pages/" });
	const tableParams = Route.useSearch();
	const { filter, orderBy, limit, offset } = tableParams;
	const navigate = useNavigate();
	const utils = trpc.useUtils();

	const {
		data: { pageOfPages, allColumns } = { pageOfPages: [], allColumns: [] },
		isPending: isPagesPending,
		error: pagesError,
		refetch: refetchPages,
	} = trpc.pages.getPagesByWhereClause.useQuery(tableParams, { initialData });

	const {
		mutate: replacePageAndUpdateCache,
		isPending: isReplacePageAndUpdateCachePending,
	} = trpc.pages.replacePage.useMutation({
		onMutate: async (newPage) => {
			skipAutoResetPageIndex();
			await utils.pages.getPagesByWhereClause.cancel();
			const prevPages = utils.pages.getPagesByWhereClause.getData(tableParams);
			utils.pages.getPagesByWhereClause.setData(
				tableParams,
				(oldPageOfPages) => {
					if (!oldPageOfPages) return;
					const { pageOfPages, allColumns } = oldPageOfPages;
					return {
						pageOfPages: pageOfPages.map((currentPage) => {
							const shouldReplacePage = currentPage.id === newPage.id;
							if (shouldReplacePage) return newPage;
							return currentPage;
						}),
						allColumns,
					};
				},
			);
			return { prevPages };
		},
		onError: (err, newPage, context) => {
			if (!context) return;
			utils.pages.getPagesByWhereClause.setData(tableParams, context.prevPages);
			toast.error("Error while saving row", {
				description: err.message,
			});
		},
		onSettled: () => {
			utils.pages.getPagesByWhereClause.invalidate(tableParams);
		},
		onSuccess: () => {
			toast.success("Saved", {
				description: "Your changes have been saved.",
			});
		},
	});

	const { mutate: addPage, isPending: isAddPagePending } =
		trpc.pages.addPage.useMutation({
			onMutate: async (newPage) => {
				skipAutoResetPageIndex();
				await utils.pages.getPagesByWhereClause.cancel();
				const prevPages =
					utils.pages.getPagesByWhereClause.getData(tableParams);
				utils.pages.getPagesByWhereClause.setData(
					tableParams,
					(oldPageOfPages) => {
						if (!oldPageOfPages) return;
						const { pageOfPages, allColumns } = oldPageOfPages;
						return {
							pageOfPages: [...pageOfPages, newPage],
							allColumns,
						};
					},
				);
				return { prevPages };
			},
			onError: (err, newPage, context) => {
				if (!context) return;
				utils.pages.getPagesByWhereClause.setData(
					tableParams,
					context.prevPages,
				);
			},
			onSettled: () => {
				utils.pages.getPagesByWhereClause.invalidate(tableParams);
			},
			onSuccess: () => {
				toast.success("Success", { description: "Row added!" });
			},
		});

	const { mutate: deletePageById, isPending: isDeletePageByIdPending } =
		trpc.pages.deletePageById.useMutation({
			onMutate: async ({ id }) => {
				await utils.pages.getPagesByWhereClause.cancel();
				const prevPages =
					utils.pages.getPagesByWhereClause.getData(tableParams);
				utils.pages.getPagesByWhereClause.setData(
					tableParams,
					(oldPageOfPages) => {
						if (!oldPageOfPages) return;
						const { pageOfPages, allColumns } = oldPageOfPages;
						return {
							pageOfPages: pageOfPages.filter((p) => p.id !== id),
							allColumns,
						};
					},
				);
				return { prevPages };
			},
			onError: (err, { id }, context) => {
				if (!context) return;
				utils.pages.getPagesByWhereClause.setData(
					tableParams,
					context.prevPages,
				);
			},
			onSettled: () => {
				utils.pages.getPagesByWhereClause.invalidate(tableParams);
			},
			onSuccess: () => {
				toast.success("Saved", {
					description: "Your changes have been saved.",
				});
			},
		});

	const columnDefs: ColumnDef<SelectPage>[] = [
		{
			id: "__actions",
			accessorKey: "id",
			header: "actions",
			cell: ({ getValue, row }) => {
				const pageId = getValue<string>();
				const correspondingPageInCache = utils.pages.getPagesByWhereClause
					.getData(tableParams)
					?.pageOfPages.find((p) => p.id === pageId);
				if (!correspondingPageInCache) return null;
				return (
					<div className="flex items-center justify-center gap-1">
						{/* <PageEditorDialog
							page={page}
							setPageSaveDbDebounce={setPageSaveDbDebounce}
							setPageSaveDbImmediate={setPageSaveDbImmediate}
							columns={allColumns}
							saveStatus={saveStatus}
							onBlur={() => setPageInPagesWithRerender(page)}
						/> */}
						<Button variant="ghost" size="icon" asChild>
							<a href={`/pages/${pageId}`}>
								<PlusIcon />
							</a>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={async () => {
								deletePageById({ id: pageId });
								toast.success("Success", { description: "Row deleted!" });
							}}
						>
							<TrashIcon />
						</Button>
					</div>
				);
			},
		},
		...allColumns.map(
			(column) =>
				({
					id: column.name,
					accessorKey: "id",
					header: column.name,
					meta: { column },
					cell: ({ getValue }) => {
						const utils = trpc.useUtils();
						const pageId = getValue<string>();
						const correspondingPageInCache = utils.pages.getPagesByWhereClause
							.getData(tableParams)
							?.pageOfPages.find((p) => p.id === pageId);
						if (!correspondingPageInCache) return null;
						return (
							<RenderValueAsCell
								key={`${pageId}-${column.name}`}
								value={
									correspondingPageInCache[column.name as keyof SelectPage] ??
									""
								}
								column={column}
								page={correspondingPageInCache}
								submitAndSyncCellValueToTable={(internalValue) =>
									replacePageAndUpdateCache({
										...correspondingPageInCache,
										[column.name]: internalValue,
									})
								}
								isSyncingCellValueToTable={isReplacePageAndUpdateCachePending}
							/>
						);
					},
				}) satisfies ColumnDef<SelectPage>,
		),
	];

	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const columnVisibilityFromFilters = calculateColumnVisibility({
		columns: allColumns,
		pages: pageOfPages,
	});
	const [userColumnVisibility, setUserColumnVisibility] =
		useState<VisibilityState>({});
	const columnVisibility = {
		...columnVisibilityFromFilters,
		...userColumnVisibility,
	};

	const table = useReactTable({
		data: pageOfPages,
		columns: columnDefs,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setUserColumnVisibility,
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

	return (
		<div className="p-4 flex flex-col justify-center gap-2">
			<FilterForm
				allColumns={allColumns}
				defaultValues={{
					filter,
					orderBy,
					limit,
					offset,
				}}
			/>
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
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{isString(column.columnDef.header)
												? column.columnDef.header
												: column.id}
										</DropdownMenuCheckboxItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							onClick={() => {
								const newPage = generateDefaultPage();
								addPage(newPage, {
									onSuccess: () => {
										navigate({ to: `/pages/${newPage.id}` });
									},
								});
							}}
							disabled={isAddPagePending}
						>
							{isAddPagePending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<PlusIcon className="mr-2 h-4 w-4" />
							)}
							{isAddPagePending ? "Adding..." : "Add"}
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
											colSpan={allColumns.length}
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
	pages: SelectPage[];
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
