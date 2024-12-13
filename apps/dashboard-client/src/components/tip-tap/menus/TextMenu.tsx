import { Button } from "@/components/tip-tap/ui/Button";
import {
	DropdownButton,
	DropdownCategoryTitle,
} from "@/components/tip-tap/ui/Dropdown";
import { TiptapIcon } from "@/components/tip-tap/ui/Icon";
import { Surface } from "@/components/tip-tap/ui/Surface";
import { Toolbar } from "@/components/tip-tap/ui/Toolbar";
import { useState } from "react";
// import { languages, tones } from '@/lib/constants'
import { TableOfContents } from "@/components/tip-tap/ui/TableOfContents";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import {
	isTextSelection,
	Node,
	type NodeViewRendererProps,
} from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import {
	BubbleMenu,
	NodeViewWrapper,
	ReactNodeViewRenderer,
} from "@tiptap/react";
import type { icons } from "lucide-react";
import { toast } from "sonner";
import { generateDefaultPage } from "@repo/dashboard-server/utils";
import { trpc } from "@/router";
import type { SelectPage } from "@repo/dashboard-server/db/schema/pages";

export function TextMenu({
	editor,
	page,
}: { editor: Editor; page: SelectPage }) {
	const { mutate: addPage } = trpc.pages.addPage.useMutation({
		onSuccess: () => {
			toast.success("Success", { description: "Row added!" });
		},
	});
	return (
		<BubbleMenu
			tippyOptions={{ popperOptions: { placement: "top-start" } }}
			editor={editor}
			pluginKey="textMenu"
			shouldShow={({ view, from }) => {
				if (!view) return false;

				const domAtPos = view.domAtPos(from ?? 0).node as HTMLElement;
				const nodeDOM = view.nodeDOM(from ?? 0) as HTMLElement;
				const node = nodeDOM ?? domAtPos;

				if (isCustomNodeSelected(editor, node)) return false;

				return isAnyTextSelected({ editor });
			}}
			updateDelay={100}
		>
			<div className="bg-card text-card-foreground inline-flex h-8 leading-none gap-1">
				<ContentTypePicker editor={editor} />
				<Separator orientation="vertical" className="mx-1" />
				<Toolbar.Button
					tooltip="Bold"
					tooltipShortcut={["Mod", "B"]}
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive("bold")}
				>
					<TiptapIcon name="Bold" />
				</Toolbar.Button>
				<Toolbar.Button
					tooltip="Italic"
					tooltipShortcut={["Mod", "I"]}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive("italic")}
				>
					<TiptapIcon name="Italic" />
				</Toolbar.Button>
				<Toolbar.Button
					tooltip="Strikethrough"
					tooltipShortcut={["Mod", "Shift", "S"]}
					onClick={() => editor.chain().focus().toggleStrike().run()}
					isActive={editor.isActive("strike")}
				>
					<TiptapIcon name="Strikethrough" />
				</Toolbar.Button>
				<Toolbar.Button
					tooltip="Subscript"
					onClick={() => editor.chain().focus().toggleSubscript().run()}
					isActive={editor.isActive("subscript")}
				>
					<TiptapIcon name="Subscript" />
				</Toolbar.Button>
				<Toolbar.Button
					tooltip="Superscript"
					onClick={() => editor.chain().focus().toggleSuperscript().run()}
					isActive={editor.isActive("superscript")}
				>
					<TiptapIcon name="Superscript" />
				</Toolbar.Button>
				<Toolbar.Button
					tooltip="Code"
					tooltipShortcut={["Mod", "E"]}
					onClick={() => editor.chain().focus().toggleCode().run()}
					isActive={editor.isActive("code")}
				>
					<TiptapIcon name="Code" />
				</Toolbar.Button>
				<Toolbar.Button
					tooltip="Code block"
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					isActive={editor.isActive("codeBlock")}
				>
					<TiptapIcon name="CodeXml" />
				</Toolbar.Button>
				<Toolbar.Button
					tooltip="Quote"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					isActive={editor.isActive("blockquote")}
				>
					<TiptapIcon name="Quote" />
				</Toolbar.Button>
				<EditLinkPopover
					onSetUrl={(url: string) =>
						editor
							.chain()
							.focus()
							.setLink({ href: url, target: "_blank" })
							.run()
					}
				/>
				<Popover.Root>
					<Popover.Trigger asChild>
						<Toolbar.Button
							tooltip="Highlight text"
							isActive={editor.isActive("highlight")}
							onClick={() => editor.chain().focus().toggleHighlight().run()}
						>
							<TiptapIcon name="Highlighter" />
						</Toolbar.Button>
					</Popover.Trigger>
					<Popover.Content side="top" sideOffset={8} asChild>
						<Surface className="p-1">
							{/* <MemoColorPicker
                color={states.currentHighlight}
                onChange={() => editor.chain().setHighlight().run()}
                onClear={() => editor.chain().focus().unsetHighlight().run()}
            /> */}
						</Surface>
					</Popover.Content>
				</Popover.Root>
				<Toolbar.Button
					tooltip="Extract to new page"
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
				>
					<TiptapIcon name="ExternalLink" />
				</Toolbar.Button>
				<Toolbar.Button
					tooltip="Quote"
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
				>
					<TiptapIcon name="Quote" />
				</Toolbar.Button>
			</div>
		</BubbleMenu>
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
		<Dropdown.Root>
			<Dropdown.Trigger asChild>
				<Toolbar.Button isActive={activeNodeType !== "paragraph"}>
					<TiptapIcon name={activeItemIcon} />
					<TiptapIcon name="ChevronDown" className="w-2 h-2" />
				</Toolbar.Button>
			</Dropdown.Trigger>
			<Dropdown.Content asChild>
				<Surface className="flex flex-col gap-1 px-2 py-4">
					<div className="mt-2 first:mt-0">
						<DropdownCategoryTitle>Hierarchy</DropdownCategoryTitle>
					</div>
					<DropdownButton
						key="paragraph"
						onClick={() =>
							editor
								.chain()
								.focus()
								.lift("taskItem")
								.liftListItem("listItem")
								.setParagraph()
								.run()
						}
						isActive={activeNodeType === "paragraph"}
					>
						<TiptapIcon name="Pilcrow" className="w-4 h-4 mr-1" />
						Paragraph
					</DropdownButton>
					<DropdownButton
						key="heading1"
						onClick={() =>
							editor
								.chain()
								.focus()
								.lift("taskItem")
								.liftListItem("listItem")
								.setHeading({ level: 1 })
								.run()
						}
						isActive={activeNodeType === "heading1"}
					>
						<TiptapIcon name="Heading1" className="w-4 h-4 mr-1" />
						Heading 1
					</DropdownButton>
					<DropdownButton
						key="heading2"
						onClick={() =>
							editor
								.chain()
								.focus()
								.lift("taskItem")
								.liftListItem("listItem")
								.setHeading({ level: 2 })
								.run()
						}
						isActive={activeNodeType === "heading2"}
					>
						<TiptapIcon name="Heading2" className="w-4 h-4 mr-1" />
						Heading 2
					</DropdownButton>
					<DropdownButton
						key="heading3"
						onClick={() =>
							editor
								.chain()
								.focus()
								.lift("taskItem")
								.liftListItem("listItem")
								.setHeading({ level: 3 })
								.run()
						}
						isActive={activeNodeType === "heading3"}
					>
						<TiptapIcon name="Heading3" className="w-4 h-4 mr-1" />
						Heading 3
					</DropdownButton>
					<div className="mt-2 first:mt-0">
						<DropdownCategoryTitle>Lists</DropdownCategoryTitle>
					</div>
					<DropdownButton
						key="bulletList"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						isActive={activeNodeType === "bulletList"}
					>
						<TiptapIcon name="List" className="w-4 h-4 mr-1" />
						Bullet list
					</DropdownButton>
					<DropdownButton
						key="orderedList"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						isActive={activeNodeType === "orderedList"}
					>
						<TiptapIcon name="ListOrdered" className="w-4 h-4 mr-1" />
						Numbered list
					</DropdownButton>
					<DropdownButton
						key="todoList"
						onClick={() => editor.chain().focus().toggleTaskList().run()}
						isActive={activeNodeType === "taskList"}
					>
						<TiptapIcon name="ListTodo" className="w-4 h-4 mr-1" />
						Todo list
					</DropdownButton>
				</Surface>
			</Dropdown.Content>
		</Dropdown.Root>
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
