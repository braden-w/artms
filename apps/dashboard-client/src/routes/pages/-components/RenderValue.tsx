import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { trpc } from "@/router";
import type { ColumnInDatabase } from "@repo/dashboard-server/COLUMNS_IN_DATABASE";
import { evaluateFilter } from "@repo/dashboard-server/conditions";
import { DEFAULT_TAG_COLOR } from "@repo/dashboard-server/constants";
import type {
	PagePropertyValue,
	SelectPage,
} from "@repo/dashboard-server/schema";
// import { TiptapEditor } from "@/components/tip-tap/TiptapEditor";
import { isStringArray } from "@repo/dashboard-server/utils";
import { parseDate } from "chrono-node";
import { parseISO } from "date-fns";
import { format, formatInTimeZone } from "date-fns-tz";
import { CalendarIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { FancyBox } from "./FancyBox";

const DEBOUNCE_MS = 500;
export type SaveStatus = "Saved" | "Unsaved";

export function RenderValueAsCell({
	value,
	column,
	isSyncingCellValueToTable: isPendingExternally,
	submitAndSyncCellValueToTable: submitSyncCellValueToTable,
	page,
}: {
	value: PagePropertyValue;
	column: ColumnInDatabase;
	isSyncingCellValueToTable: boolean;
	submitAndSyncCellValueToTable: (finalValue: PagePropertyValue) => void;
	page: SelectPage;
}) {
	const { mutate: replacePage } = trpc.pages.replacePage.useMutation();
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [internalValue, setInternalValue] = useState(value);
	const [previousValue, setPreviousValue] = useState(value);
	if (value !== previousValue) {
		setPreviousValue(value);
		setInternalValue(value);
	}

	const id = `${page.id}-${column.name}`;
	const displayValue = isStringArray(internalValue)
		? JSON.stringify(internalValue)
		: (internalValue ?? "");
	const isDisabled =
		(column.filter && !evaluateFilter(page, column.filter)) ?? false;
	const saveStatus: SaveStatus =
		hasUnsavedChanges || isPendingExternally ? "Unsaved" : "Saved";
	const TRIGGER_CLASS = cn(
		buttonVariants({ variant: !isDisabled ? "ghost" : "secondary" }),
		"h-full w-full justify-start truncate rounded-none py-0 font-normal min-h-10",
	);

	const debouncedReplacePage = useDebouncedCallback(
		(newValue: PagePropertyValue) =>
			replacePage(
				{ ...page, [column.name]: newValue },
				{ onSettled: () => setHasUnsavedChanges(false) },
			),
		DEBOUNCE_MS,
	);

	const onChange = (newValue: PagePropertyValue) => {
		/* Make update synchronous, to avoid caret jumping when the value doesn't change asynchronously */
		setInternalValue(newValue);
		setHasUnsavedChanges(true);
		/* Make the real update afterwards */
		debouncedReplacePage(newValue);
	};

	switch (column.type) {
		case "ID":
			return (
				<Input
					id={id}
					className="rounded-none"
					value={displayValue}
					disabled={isDisabled}
				/>
			);
		case "Number":
			return (
				<Input
					id={id}
					className="rounded-none"
					value={displayValue}
					onChange={(e) => onChange(e.target.value)}
					onBlur={(e) => submitSyncCellValueToTable(e.target.value)}
					disabled={isDisabled}
				/>
			);
		case "Text":
			return (
				<Popover>
					<PopoverTrigger asChild>
						<button
							className={TRIGGER_CLASS}
							disabled={isDisabled}
							type="button"
						>
							{displayValue}
						</button>
					</PopoverTrigger>
					<PopoverContent className="p-0">
						<div className="bg-accent text-muted-foreground absolute right-5 top-5 z-10 mb-5 rounded-lg px-2 py-1 text-sm">
							{saveStatus}
						</div>
						<Input
							id={id}
							value={displayValue}
							onChange={(e) => onChange(e.target.value)}
							onBlur={(e) => submitSyncCellValueToTable(e.target.value)}
							disabled={isDisabled}
						/>
					</PopoverContent>
				</Popover>
			);
		case "Textarea":
			return (
				<Dialog
					onOpenChange={(isOpen) => {
						if (!isOpen) submitSyncCellValueToTable(internalValue);
					}}
				>
					<DialogTrigger asChild>
						<button className={TRIGGER_CLASS} disabled={isDisabled}>
							{displayValue}
						</button>
					</DialogTrigger>
					<DialogContent className="flex h-full max-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col overflow-y-auto">
						{/* <TiptapEditor
							value={displayValue}
							setValue={onChange}
							saveStatus={saveStatus}
							page={page}
						/> */}
					</DialogContent>
				</Dialog>
			);
		case "Date":
			return (
				<NaturalLanguageInput
					value={displayValue}
					dateDisplayFormat={column.dateDisplayFormat}
					saveStatus={saveStatus}
					setValue={onChange}
					onPopoverClose={() => submitSyncCellValueToTable(internalValue)}
					disabled={isDisabled}
					className={TRIGGER_CLASS}
					page={page}
				/>
			);
		case "Select":
			return (
				<SingleSelectCombobox
					value={displayValue}
					column={column}
					setValue={onChange}
					onPopoverClose={() => submitSyncCellValueToTable(internalValue)}
					disabled={isDisabled}
					className={TRIGGER_CLASS}
				/>
			);
		case "Multi-select":
			return (
				<MultiSelectCombobox
					value={isStringArray(value) ? value : []}
					column={column}
					setValue={onChange}
					onPopoverClose={() => submitSyncCellValueToTable(internalValue)}
					disabled={isDisabled}
					className={TRIGGER_CLASS}
				/>
			);
		case "Checkbox":
			return (
				<Checkbox
					checked={value === "TRUE"}
					onCheckedChange={(value) => {
						if (value === "indeterminate") return;
						const newValue = value ? "TRUE" : "FALSE";
						onChange(newValue);
						submitSyncCellValueToTable(newValue);
					}}
					disabled={isDisabled}
				/>
			);
		default:
			return <span>{displayValue}</span>;
	}
}

export function SingleSelectCombobox({
	value,
	column,
	setValue,
	onPopoverClose,
	disabled = false,
	className,
}: {
	value: string;
	column: ColumnInDatabase;
	setValue: (value: string) => void;
	onPopoverClose?: () => void;
	disabled?: boolean;
	className?: string;
}) {
	const [options, setOptions] = useState(column.options);
	const selectedOption = options.find((o) => o.value === value) ?? {
		value,
		color: DEFAULT_TAG_COLOR,
	};
	const debouncedSetOption = useDebouncedCallback(
		async (newOptions) => {
			const { data, error } = await actions.columns.setColumn({
				...column,
				options: newOptions,
			});
			toast.success("Saved", { description: "Your changes have been saved." });
		},
		500,
		{ leading: false, trailing: true },
	);
	return (
		<FancyBox
			name={column.name}
			options={options}
			setOptions={async (update) => {
				setOptions(update);
				const newOptions =
					typeof update === "function" ? update(options) : update;
				debouncedSetOption(newOptions);
			}}
			selectedOptions={[selectedOption]}
			setSelectedOptions={(update) => {
				const newSelectedOptions =
					typeof update === "function" ? update([selectedOption]) : update;
				setValue(newSelectedOptions.at(-1)?.value ?? "");
			}}
			onPopoverClose={onPopoverClose}
			disabled={disabled}
			shortcut={column.shortcut}
			className={className}
		/>
	);
}

export function MultiSelectCombobox({
	value: values,
	column,
	setValue,
	onPopoverClose,
	disabled = false,
	className,
}: {
	value: string[];
	column: ColumnInDatabase;
	setValue: (value: string[]) => void;
	onPopoverClose: () => void;
	disabled?: boolean;
	className: string;
}) {
	const [options, setOptions] = useState(column.options);
	const selectedOptions = values.map(
		(value) =>
			options.find((o) => o.value === value) ?? {
				value,
				color: DEFAULT_TAG_COLOR,
			},
	);
	const debouncedSetOption = useDebouncedCallback(
		async (newOptions) => {
			const { data, error } = await actions.columns.setColumn({
				...column,
				options: newOptions,
			});
			toast.success("Saved", {
				description: "Your changes have been saved.",
			});
		},
		500,
		{ leading: false, trailing: true },
	);
	return (
		<FancyBox
			name={column.name}
			options={options}
			setOptions={(update) => {
				setOptions(update);
				const newOptions =
					typeof update === "function" ? update(options) : update;
				debouncedSetOption(newOptions);
			}}
			selectedOptions={selectedOptions}
			setSelectedOptions={(update) => {
				const newSelectedOptions =
					typeof update === "function" ? update(selectedOptions) : update;
				setValue(newSelectedOptions.map((o) => o.value));
			}}
			onPopoverClose={onPopoverClose}
			disabled={disabled}
			shortcut={column.shortcut}
			className={className}
		/>
	);
}

export function NaturalLanguageInput({
	value,
	dateDisplayFormat,
	saveStatus,
	setValue,
	onPopoverClose,
	className,
	disabled = false,
	page,
}: {
	value: string;
	dateDisplayFormat: string;
	saveStatus: SaveStatus;
	setValue: (value: string) => void;
	onPopoverClose: () => void;
	className?: string;
	disabled?: boolean;
	page: SelectPage;
}) {
	const [naturalLanguageInput, setNaturalLanguageInput] = useState("");

	const naturalLanguageToIsoString = (naturalLanguageInput: string) => {
		const parsedDate = parseDate(naturalLanguageInput);
		if (!parsedDate) return value;
		const isoString = parsedDate.toISOString();
		return isoString;
	};

	const readableWithRespectToUserTimezone = format(
		parseISO(value),
		dateDisplayFormat,
	);

	const readableWithRespectToPageTimezone = page.timezone
		? formatInTimeZone(parseISO(value), page.timezone, dateDisplayFormat)
		: "No timezone set";

	return (
		<Popover
			onOpenChange={(isOpen) => {
				if (!isOpen) onPopoverClose();
			}}
		>
			<PopoverTrigger asChild>
				<button className={className} disabled={disabled}>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{readableWithRespectToPageTimezone}
				</button>
			</PopoverTrigger>
			<PopoverContent className="flex w-full max-w-7xl flex-col gap-2">
				<div className="bg-accent text-muted-foreground absolute right-5 top-5 z-10 mb-5 rounded-lg px-2 py-1 text-sm">
					{saveStatus}
				</div>
				<Fieldset label="Date" id="date" value={value} disabled />
				<Fieldset
					label="Input"
					id="naturalLanguageInput"
					value={naturalLanguageInput}
					onChange={(e) => {
						const newNaturalLanguageInput = e.target.value;
						setNaturalLanguageInput(newNaturalLanguageInput);
						setValue(naturalLanguageToIsoString(newNaturalLanguageInput));
					}}
				/>
				<Fieldset
					label="Readable with respect to your timezone"
					id="readableWithRespectToUserTimezone"
					value={readableWithRespectToUserTimezone}
					disabled
				/>
				<Fieldset
					label="Readable with respect to page timezone"
					id="readableWithRespectToSetTimezone"
					value={readableWithRespectToPageTimezone}
					disabled
				/>
			</PopoverContent>
		</Popover>
	);
}

function Fieldset({
	label,
	id,
	value,
	disabled,
	onChange,
}:
	| {
			label: string;
			id: string;
			value: string;
			onChange?: never;
			disabled: boolean;
	  }
	| {
			label: string;
			id: string;
			value: string;
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
			disabled?: never;
	  }) {
	return (
		<fieldset className="flex items-center space-x-4">
			<Label htmlFor={id} className="w-1/4">
				{label}
			</Label>
			<Input
				id={id}
				className="w-3/4"
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
		</fieldset>
	);
}

function InvalidValue({ value }: { value: PagePropertyValue }) {
	return (
		<Input
			className="rounded-none"
			value={value === null ? "" : value}
			disabled
		/>
	);
}
