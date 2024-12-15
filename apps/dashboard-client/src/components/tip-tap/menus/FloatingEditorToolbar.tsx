import { Button } from "@/components/tip-tap/ui/Button";
import { TiptapIcon } from "@/components/tip-tap/ui/Icon";
import { Surface } from "@/components/tip-tap/ui/Surface";
import { TableOfContents } from "@/components/tip-tap/ui/TableOfContents";
import { Toolbar } from "@/components/tip-tap/ui/Toolbar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { trpc } from "@/router";
import * as Popover from "@radix-ui/react-popover";
import type { SelectPage } from "@repo/dashboard-server/db/schema/pages";
import { generateDefaultPage } from "@repo/dashboard-server/utils";
import {
	Node,
	type NodeViewRendererProps,
	isTextSelection,
} from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { icons } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useEditorFloatingMenu } from "./useFloatingMenu";

export function FloatingEditorToolbar({
	editor,
	page,
}: { editor: Editor; page: SelectPage }) {
	const { mutate: addPage } = trpc.pages.addPage.useMutation({
		onSuccess: () => {
			toast.success("Success", { description: "Row added!" });
		},
	});
	const { refs, floatingStyles, isFloatingMenuOpen, getFloatingProps } =
		useEditorFloatingMenu({
			editor,
			shouldShow: (editor) => {
				const { state } = editor;
				const { empty: isSelectionEmpty, from, to } = state.selection;
				const isEmptyTextBlock = !state.doc.textBetween(from, to).length;
				return !isSelectionEmpty && !isEmptyTextBlock && editor.isEditable;
			},
		});

	if (!isFloatingMenuOpen) return null;

	return (
		<div
			ref={refs.setFloating}
			style={floatingStyles}
			{...getFloatingProps()}
			className="z-50 bg-card text-card-foreground shadow-lg rounded-lg p-1"
		>
			<div className="bg-card text-card-foreground inline-flex h-8 leading-none gap-1">
				<ContentTypePicker editor={editor} />
				<Separator orientation="vertical" className="mx-1" />
				<ToggleButtonWithTooltip
					icon="Bold"
					tooltipTitle="Bold"
					tooltipShortcut={["Mod", "B"]}
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive("bold")}
				/>
				<ToggleButtonWithTooltip
					icon="Italic"
					tooltipTitle="Italic"
					tooltipShortcut={["Mod", "I"]}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive("italic")}
				/>
				<ToggleButtonWithTooltip
					icon="Strikethrough"
					tooltipTitle="Strikethrough"
					tooltipShortcut={["Mod", "Shift", "S"]}
					onClick={() => editor.chain().focus().toggleStrike().run()}
					isActive={editor.isActive("strike")}
				/>
				<ToggleButtonWithTooltip
					icon="Subscript"
					tooltipTitle="Subscript"
					onClick={() => editor.chain().focus().toggleSubscript().run()}
					isActive={editor.isActive("subscript")}
				/>
				<ToggleButtonWithTooltip
					icon="Superscript"
					tooltipTitle="Superscript"
					onClick={() => editor.chain().focus().toggleSuperscript().run()}
					isActive={editor.isActive("superscript")}
				/>
				<ToggleButtonWithTooltip
					icon="Code"
					tooltipTitle="Code"
					tooltipShortcut={["Mod", "E"]}
					onClick={() => editor.chain().focus().toggleCode().run()}
					isActive={editor.isActive("code")}
				/>
				<ToggleButtonWithTooltip
					icon="CodeXml"
					tooltipTitle="Code block"
					tooltipShortcut={["Mod", "E"]}
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					isActive={editor.isActive("codeBlock")}
				/>
				<ToggleButtonWithTooltip
					icon="Quote"
					tooltipTitle="Quote"
					tooltipShortcut={["Mod", "E"]}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					isActive={editor.isActive("blockquote")}
				/>
				<EditLinkPopover
					onSetUrl={(url: string) =>
						editor
							.chain()
							.focus()
							.setLink({ href: url, target: "_blank" })
							.run()
					}
				/>
				<ToggleButtonWithTooltip
					icon="Highlighter"
					tooltipTitle="Highlight text"
					onClick={() => editor.chain().focus().toggleHighlight().run()}
					isActive={editor.isActive("highlight")}
				/>

				<ToggleButtonWithTooltip
					icon="ExternalLink"
					tooltipTitle="Extract to new page"
					onClick={async () => {
						const { from, to } = editor.view.state.selection;
						const selectedText = editor.view.state.doc.textBetween(
							from,
							to,
							"\n\n",
						);
						const title = prompt("Note title", selectedText) ?? selectedText;
						const content = selectedText;
						const newPage = generateDefaultPage({
							...page,
							on: [],
							type: [],
							title,
							content,
						});
						addPage(newPage);
						const pageLink =
							`[${newPage.title}](/pages/${newPage.id})` as const;
						editor.chain().focus().insertContent(pageLink).run();
					}}
					isActive={false}
				/>
				<ToggleButtonWithTooltip
					icon="Youtube"
					tooltipTitle="Youtube"
					onClick={() => {
						const url = prompt("Enter YouTube URL");

						if (url) {
							editor.commands.setYoutubeVideo({
								src: url,
								width: Math.max(320, 640),
								height: Math.max(180, 480),
							});
						}
					}}
					isActive={false}
				/>
			</div>
		</div>
	);
}

const isMac =
	typeof window !== "undefined" ? /Mac/.test(navigator.userAgent) : false;

function ToggleButtonWithTooltip({
	tooltipTitle,
	tooltipShortcut,
	onClick,
	icon: iconName,
	isActive,
}: {
	tooltipTitle: string;
	tooltipShortcut?: string[];
	onClick: () => void;
	icon: keyof typeof icons;
	isActive: boolean;
}) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Toggle
						aria-label={tooltipTitle}
						pressed={isActive}
						onPressedChange={onClick}
					>
						<TiptapIcon name={iconName} />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>
					<span className="flex items-center gap-2 px-2.5 py-1 bg-white border border-neutral-100 rounded-lg shadow-sm z-[999]">
						<span className="text-xs font-medium text-neutral-500">
							{tooltipTitle}
						</span>
						{tooltipShortcut && (
							<span className="flex items-center gap-0.5">
								{tooltipShortcut.map((shortcutKey) => {
									const shortcutKeyText = (() => {
										if (shortcutKey === "Mod") {
											return isMac ? "⌘" : "Ctrl";
										}
										if (shortcutKey === "Shift") {
											return "⇧";
										}
										if (shortcutKey === "Alt") {
											return isMac ? "⌥" : "Alt";
										}
										return shortcutKey;
									})();
									const className =
										"inline-flex items-center justify-center w-5 h-5 p-1 text-[0.625rem] rounded font-semibold leading-none border border-neutral-200 text-neutral-500 border-b-2";
									return (
										<kbd className={className} key={shortcutKey}>
											{shortcutKeyText}
										</kbd>
									);
								})}
							</span>
						)}
					</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

function isTableGripSelected(node: HTMLElement) {
	let container = node;

	while (container && !["TD", "TH"].includes(container.tagName)) {
		container = container.parentElement!;
	}

	const gripColumn =
		container &&
		container.querySelector &&
		container.querySelector("a.grip-column.selected");
	const gripRow =
		container &&
		container.querySelector &&
		container.querySelector("a.grip-row.selected");

	if (gripColumn || gripRow) {
		return true;
	}

	return false;
}

function isCustomNodeSelected(editor: Editor, node: HTMLElement) {
	const customNodes = [
		// HorizontalRule.name,
		// ImageBlock.name,
		// ImageUpload.name,
		// CodeBlock.name,
		// ImageBlock.name,
		// Link.name,
		// AiWriter.name,
		// AiImage.name,
		// Figcaption.name,
		TableOfContentsNode.name,
	];

	return (
		customNodes.some((type) => editor.isActive(type)) ||
		isTableGripSelected(node)
	);
}

function isAnyTextSelected({ editor }: { editor: Editor }) {
	const {
		state: {
			doc,
			selection,
			selection: { empty, from, to },
		},
	} = editor;

	// Sometime check for `empty` is not enough.
	// Doubleclick an empty paragraph returns a node size of 2.
	// So we check also for an empty text size.
	const isEmptyTextBlock =
		doc.textBetween(from, to).length === 0 && isTextSelection(selection);

	if (empty || isEmptyTextBlock || !editor.isEditable) return false;

	return true;
}

function TableOfNodeContent(props: NodeViewRendererProps) {
	const { editor } = props;
	return (
		<NodeViewWrapper>
			<div className="p-2 -m-2 rounded-lg" contentEditable={false}>
				<TableOfContents editor={editor} />
			</div>
		</NodeViewWrapper>
	);
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		tableOfContentsNode: {
			insertTableOfContents: () => ReturnType;
		};
	}
}

export const TableOfContentsNode = Node.create({
	name: "tableOfContentsNode",
	group: "block",
	atom: true,
	selectable: true,
	draggable: true,
	inline: false,

	parseHTML() {
		return [
			{
				tag: 'div[data-type="table-of-content"]',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ["div", { ...HTMLAttributes, "data-type": "table-of-content" }];
	},

	addNodeView() {
		return ReactNodeViewRenderer(TableOfNodeContent);
	},

	addCommands() {
		return {
			insertTableOfContents:
				() =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
					});
				},
		};
	},
});

function ContentTypePicker({ editor }: { editor: Editor }) {
	const getActiveNodeType = () => {
		if (editor.isActive("heading", { level: 1 })) return "heading1";
		if (editor.isActive("heading", { level: 2 })) return "heading2";
		if (editor.isActive("heading", { level: 3 })) return "heading3";
		if (editor.isActive("heading", { level: 4 })) return "heading4";
		if (editor.isActive("heading", { level: 5 })) return "heading5";
		if (editor.isActive("heading", { level: 6 })) return "heading6";
		if (editor.isActive("bulletList")) return "bulletList";
		if (editor.isActive("orderedList")) return "orderedList";
		if (editor.isActive("taskList")) return "taskList";
		if (editor.isActive("codeBlock")) return "codeBlock";
		if (editor.isActive("paragraph")) return "paragraph";
		// if (editor.isActive('blockquote')) return 'blockquote';
		// if (editor.isActive('horizontalRule')) return 'horizontalRule';
		// if (editor.isActive('table')) return 'table';
		// if (editor.isActive('tableRow')) return 'tableRow';
		// if (editor.isActive('tableCell')) return 'tableCell';
		// if (editor.isActive('tableHeader')) return 'tableHeader';
		// if (editor.isActive('image')) return 'image';
		// if (editor.isActive('hardBreak')) return 'hardBreak';
		// if (editor.isActive('listItem')) return 'listItem';
		// if (editor.isActive('taskItem')) return 'taskItem';
		// if (editor.isActive('mention')) return 'mention';
		// if (editor.isActive('emoji')) return 'emoji';
		// if (editor.isActive('placeholder')) return 'placeholder';
		// if (editor.isActive('youtube')) return 'youtube';
		// if (editor.isActive('iframe')) return 'iframe';
		// if (editor.isActive('figcaption')) return 'figcaption';
		// if (editor.isActive('figure')) return 'figure';
		// if (editor.isActive('details')) return 'details';
		// if (editor.isActive('summary')) return 'summary';
		return "paragraph";
	};

	const activeNodeType = getActiveNodeType();

	const activeNodeTypeToIcon = {
		heading1: "Heading1",
		heading2: "Heading2",
		heading3: "Heading3",
		heading4: "Heading4",
		heading5: "Heading5",
		heading6: "Heading6",
		bulletList: "List",
		orderedList: "ListOrdered",
		taskList: "ListTodo",
		paragraph: "Pilcrow",
		codeBlock: "Code",
	} satisfies Record<typeof activeNodeType, keyof typeof icons>;

	const activeItemIcon = activeNodeTypeToIcon[activeNodeType];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Toolbar.Button isActive={activeNodeType !== "paragraph"}>
					<TiptapIcon name={activeItemIcon} />
					<TiptapIcon name="ChevronDown" className="w-2 h-2" />
				</Toolbar.Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-[180px]">
				<div className="flex flex-col gap-1 px-2 py-4">
					<DropdownMenuLabel>Hierarchy</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() =>
							editor
								.chain()
								.focus()
								.lift("taskItem")
								.liftListItem("listItem")
								.setParagraph()
								.run()
						}
						className={cn(
							activeNodeType === "paragraph" &&
								"bg-accent text-accent-foreground ",
						)}
					>
						<TiptapIcon name="Pilcrow" className="w-4 h-4 mr-2" />
						Paragraph
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							editor
								.chain()
								.focus()
								.lift("taskItem")
								.liftListItem("listItem")
								.setHeading({ level: 1 })
								.run()
						}
						className={cn(
							activeNodeType === "heading1" &&
								"bg-accent text-accent-foreground ",
						)}
					>
						<TiptapIcon name="Heading1" className="w-4 h-4 mr-2" />
						Heading 1
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							editor
								.chain()
								.focus()
								.lift("taskItem")
								.liftListItem("listItem")
								.setHeading({ level: 2 })
								.run()
						}
						className={cn(
							activeNodeType === "heading2" &&
								"bg-accent text-accent-foreground ",
						)}
					>
						<TiptapIcon name="Heading2" className="w-4 h-4 mr-2" />
						Heading 2
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							editor
								.chain()
								.focus()
								.lift("taskItem")
								.liftListItem("listItem")
								.setHeading({ level: 3 })
								.run()
						}
						className={cn(
							activeNodeType === "heading3" &&
								"bg-accent text-accent-foreground ",
						)}
					>
						<TiptapIcon name="Heading3" className="w-4 h-4 mr-2" />
						Heading 3
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DropdownMenuLabel>Lists</DropdownMenuLabel>

					<DropdownMenuItem
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={cn(
							activeNodeType === "bulletList" &&
								"bg-accent text-accent-foreground ",
						)}
					>
						<TiptapIcon name="List" className="w-4 h-4 mr-2" />
						Bullet list
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={cn(
							activeNodeType === "orderedList" &&
								"bg-accent text-accent-foreground ",
						)}
					>
						<TiptapIcon name="ListOrdered" className="w-4 h-4 mr-2" />
						Numbered list
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => editor.chain().focus().toggleTaskList().run()}
						className={cn(
							activeNodeType === "taskList" &&
								"bg-accent text-accent-foreground ",
						)}
					>
						<TiptapIcon name="ListTodo" className="w-4 h-4 mr-2" />
						Todo list
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function EditLinkPopover({ onSetUrl }: { onSetUrl: (link: string) => void }) {
	const [url, setUrl] = useState("");
	const isValidUrl = /^(\S+):(\/\/)?\S+|\/\S+$/.test(url);
	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<Toolbar.Button tooltip="Set Link">
					<TiptapIcon name="Link" />
				</Toolbar.Button>
			</Popover.Trigger>
			<Popover.Content>
				<Surface className="p-2">
					<form
						onSubmit={(e: React.FormEvent) => {
							e.preventDefault();
							if (isValidUrl) onSetUrl(url);
						}}
						className="flex items-center gap-2"
					>
						<label
							htmlFor="url"
							className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-text"
						>
							<TiptapIcon
								name="Link"
								className="flex-none text-black dark:text-white"
							/>
							<input
								id="url"
								className="flex-1 bg-transparent outline-none min-w-[12rem] text-black text-sm dark:text-white"
								placeholder="Enter URL"
								value={url}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setUrl(event.target.value);
								}}
							/>
						</label>
						<Button
							variant="primary"
							buttonSize="small"
							type="submit"
							disabled={!isValidUrl}
						>
							Set Link
						</Button>
					</form>
				</Surface>
			</Popover.Content>
		</Popover.Root>
	);
}
