import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { DEFAULT_TAG_COLOR } from "@/constants";
import { cn } from "@/lib/utils";
import type { Option } from "@repo/dashboard-server/schema";
import { Check, ChevronsUpDown, Edit2 } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

// FIXME: https://twitter.com/lemcii/status/1659649371162419202?s=46&t=gqNnMIjMWXiG2Rbrr5gT6g
// Removing states would help maybe?

export const options = [
	{ value: "Generational", color: "#ef4444" },
	{ value: "Transformative", color: "#34eb77" },
	{ value: "Extreme", color: "#fbbd08" },
	{ value: "Profound", color: "#9b51e0" },
	{ value: "Moderate", color: "#2d9cdb" },
	{ value: "Mild", color: "#e63946" },
	{ value: "Minimal", color: "#8d99ae" },
] satisfies Option[];

const badgeStyle = (color: string) =>
	`bg-${color}-100 text-${color}-800 dark:bg-${color}-600 dark:text-${color}-50 dark:border-transparent hover:bg-${color}-200 hover:text-${color}-900` as const;

export function FancyBox({
	name,
	options,
	setOptions,
	selectedOptions,
	setSelectedOptions,
	onPopoverClose,
	disabled,
	shortcut,
	className,
}: {
	name: string;
	options: Option[];
	setOptions: Dispatch<SetStateAction<Option[]>>;
	selectedOptions: Option[];
	setSelectedOptions: Dispatch<SetStateAction<Option[]>>;
	onPopoverClose?: () => void;
	disabled: boolean;
	shortcut?: string | undefined | null;
	className?: string;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [openCombobox, setOpenCombobox] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [inputValue, setInputValue] = useState<string>("");

	useHotkeys(
		shortcut ?? "",
		(e) => {
			e.preventDefault();
			setOpenCombobox((prev) => !prev);
		},
		[open],
	);

	const createOption = (name: string) => {
		const newOption = {
			value: name,
			color: DEFAULT_TAG_COLOR,
		};
		setOptions((prev) => [...prev, newOption]);
		setSelectedOptions((prev) => [...prev, newOption]);
		setInputValue("");
	};

	const toggleOption = (option: Option) => {
		setSelectedOptions((currentOptions) =>
			!currentOptions.includes(option)
				? [...currentOptions, option]
				: currentOptions.filter((l) => l.value !== option.value),
		);
		setInputValue("");
		inputRef?.current?.focus();
	};

	const updateOption = (option: Option, newOption: Option) => {
		setOptions((prev) =>
			prev.map((o) => (o.value === option.value ? newOption : o)),
		);
		setSelectedOptions((prev) =>
			prev.map((o) => (o.value === option.value ? newOption : o)),
		);
	};

	const deleteOption = (option: Option) => {
		setOptions((prev) => prev.filter((o) => o.value !== option.value));
		setSelectedOptions((prev) => prev.filter((o) => o.value !== option.value));
	};

	const onComboboxOpenChange = (isOpen: boolean) => {
		inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
		if (!isOpen && onPopoverClose) onPopoverClose();
		setOpenCombobox(isOpen);
	};

	return (
		<div className="w-full">
			<Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
				<PopoverTrigger asChild>
					<button
						role="combobox"
						aria-expanded={openCombobox}
						className={cn(
							"w-full flex ml-auto justify-between text-foreground",
							className,
						)}
						disabled={disabled}
					>
						<span className="truncate w-full text-left">
							{selectedOptions.length === 0
								? name
								: selectedOptions.map(({ value, color }) => (
										<Badge
											key={value}
											className={cn("mb-2 mr-2", badgeStyle(color))}
										>
											{value}
										</Badge>
									))}
						</span>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-[400px] p-0">
					<Command loop>
						<CommandInput
							ref={inputRef}
							placeholder="Search option..."
							value={inputValue}
							onValueChange={setInputValue}
						/>
						<CommandList>
							<CommandGroup className="max-h-[145px] overflow-auto">
								{options.map((option) => {
									const isActive = selectedOptions.includes(option);
									return (
										<CommandItem
											key={option.value}
											value={option.value}
											onSelect={() => toggleOption(option)}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													isActive ? "opacity-100" : "opacity-0",
												)}
											/>
											<div className="flex-1">{option.value}</div>
											<div
												className={cn(
													"h-4 w-4 rounded-full",
													`bg-${option.color}-400 dark:bg-${option.color}-400`,
												)}
											/>
										</CommandItem>
									);
								})}
							</CommandGroup>
							<CommandSeparator alwaysRender />
							<CommandGroup>
								<CommandItemCreate
									onSelect={() => createOption(inputValue)}
									inputValue={inputValue}
									options={options}
								/>
								<CommandItem
									value={`:${inputValue}:`} // HACK: that way, the edit button will always be shown
									className="text-xs text-muted-foreground"
									onSelect={() => setOpenDialog(true)}
								>
									<div className={cn("mr-2 h-4 w-4")} />
									<Edit2 className="mr-2 h-2.5 w-2.5" />
									Edit Labels
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<Dialog
				open={openDialog}
				onOpenChange={(open) => {
					if (!open) {
						setOpenCombobox(true);
					}
					setOpenDialog(open);
				}}
			>
				<DialogContent className="flex max-h-[90vh] flex-col">
					<DialogHeader>
						<DialogTitle>Edit Labels</DialogTitle>
						<DialogDescription>
							Change the label names or delete the labels. Create a label
							through the combobox though.
						</DialogDescription>
					</DialogHeader>
					<div className="-mx-6 flex-1 overflow-scroll px-6 py-2">
						{options.map((option) => {
							return (
								<DialogListItem
									key={option.value}
									onDelete={() => deleteOption(option)}
									onSubmit={(e) => {
										e.preventDefault();
										const target = e.target as typeof e.target &
											Record<"name" | "color", { value: string }>;
										const newOption = {
											value: target.name.value,
											color: target.color.value,
										};
										updateOption(option, newOption);
									}}
									{...option}
								/>
							);
						})}
					</div>
					<DialogFooter className="bg-opacity-40">
						<DialogClose asChild>
							<Button variant="outline">Close</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* TODO: Display Badges */}
			{/* <div className="relative -mb-24 mt-3 h-24 overflow-y-auto">
				{selectedOptions.map(({ value, color }) => (
					<Badge
						key={value}
						style={badgeStyle(color)}
						className="mb-2 mr-2"
					>
						{value}
					</Badge>
				))}
			</div> */}
		</div>
	);
}

const CommandItemCreate = ({
	inputValue,
	options,
	onSelect,
}: {
	inputValue: string;
	options: Option[];
	onSelect: () => void;
}) => {
	const hasNoOption = !options
		.map(({ value }) => value)
		.includes(`${inputValue.toLowerCase()}`);

	const isValueNonEmptyString = inputValue !== "";
	const isShouldRender = isValueNonEmptyString && hasNoOption;

	if (!isShouldRender) return null;

	// BUG: whenever a space is appended, the Create-Button will not be shown.
	return (
		<CommandItem
			key={inputValue}
			value={inputValue}
			className="text-xs text-muted-foreground"
			onSelect={onSelect}
		>
			<div className={cn("mr-2 h-4 w-4")} />
			Create new label &quot;{inputValue}&quot;
		</CommandItem>
	);
};

const DialogListItem = ({
	value,
	color,
	onSubmit,
	onDelete,
}: Option & {
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	onDelete: () => void;
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [accordionValue, setAccordionValue] = useState<string>("");
	const [inputValue, setInputValue] = useState<string>(value);
	const [colorValue, setColorValue] = useState<string>(color);
	const disabled = value === inputValue && color === colorValue;

	useEffect(() => {
		if (accordionValue !== "") {
			inputRef.current?.focus();
		}
	}, [accordionValue]);

	return (
		<Accordion
			key={value}
			type="single"
			collapsible
			value={accordionValue}
			onValueChange={setAccordionValue}
		>
			<AccordionItem value={value}>
				<div className="flex items-center justify-between">
					<div>
						<Badge className={badgeStyle(color)}>{value}</Badge>
					</div>
					<div className="flex items-center gap-4">
						<AccordionTrigger>Edit</AccordionTrigger>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								{/* REMINDER: size="xs" */}
								<Button variant="destructive" size="xs">
									Delete
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
									<AlertDialogDescription>
										You are about to delete the label{" "}
										<Badge className={badgeStyle(color)}>{value}</Badge> .
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={onDelete}>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
				<AccordionContent>
					<form
						className="flex items-end gap-4"
						onSubmit={(e) => {
							onSubmit(e);
							setAccordionValue("");
						}}
					>
						<div className="grid w-full gap-3">
							<Label htmlFor="name">Label name</Label>
							<Input
								ref={inputRef}
								id="name"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								className="h-8"
							/>
						</div>
						<div className="grid gap-3">
							<Label htmlFor="color">Color</Label>
							<Input
								id="color"
								type="color"
								value={colorValue}
								onChange={(e) => setColorValue(e.target.value)}
								className="h-8 px-2 py-1"
							/>
						</div>
						{/* REMINDER: size="xs" */}
						<Button type="submit" disabled={disabled} size="xs">
							Save
						</Button>
					</form>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
