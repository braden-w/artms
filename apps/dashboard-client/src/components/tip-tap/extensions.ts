// import { // 	UpdatedImage, // } from 'novel/extensions';
// import { UploadImagesPlugin } from 'novel/plugins';
import { cn, getFileStemAndExtension } from "@/lib/utils";
import GlobalDragHandle from "@epicenterhq/tiptap-extension-global-drag-handle";
import { nanoid } from "@repo/dashboard-server/utils";
import FileHandler from "@tiptap-pro/extension-file-handler";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import AutoJoiner from "tiptap-extension-auto-joiner"; // optional
import { Markdown } from "tiptap-markdown";
import { encodeArrayBufferToUrlSafeBase64 } from "./arrayBufferToBase64";
import { RenderMedia } from "./extensions/RenderMedia";
import { SlashCommand } from "./extensions/SlashCommand";
import { TabHandler } from "./extensions/TabHandler";
import { YouTube } from "./extensions/YouTube";
import { EmbedContent } from "./menus/EmbedContent";
import { SuggestionExtension } from "./menus/Suggestions/SuggestionExtension";

export const createExtensions = () => [
	SuggestionExtension,
	StarterKit.configure({
		bulletList: {
			HTMLAttributes: {
				class: cn("list-disc list-outside leading-3 -mt-2"),
			},
		},
		orderedList: {
			HTMLAttributes: {
				class: cn("list-decimal list-outside leading-3 -mt-2"),
			},
		},
		listItem: {
			HTMLAttributes: {
				class: cn("leading-normal -mb-2"),
			},
		},
		blockquote: {
			HTMLAttributes: {
				class: cn("border-l-4 border-primary"),
			},
		},
		codeBlock: false,
		code: {
			HTMLAttributes: {
				class: cn("rounded-md bg-muted px-1.5 py-1 font-mono font-medium"),
				spellcheck: "false",
			},
		},
		horizontalRule: false,
		dropcursor: {
			color: "#DBEAFE",
			width: 4,
		},
		gapcursor: false,
	}),
	TabHandler,
	Superscript.configure({
		HTMLAttributes: {
			class: cn("text-xs align-top"),
		},
	}),
	Subscript.configure({
		HTMLAttributes: {
			class: cn("text-xs align-bottom"),
		},
	}),
	Highlight.configure({
		HTMLAttributes: {
			class: cn(
				"relative rounded bg-muted text-muted-foreground px-[0.3rem] py-[0.2rem] font-semibold",
			),
		},
	}),
	Placeholder.configure({
		placeholder: ({ node }) => {
			const { type, attrs } = node;
			switch (type.name) {
				case "heading":
					return `Heading ${attrs.level ?? 1}`;
				case "paragraph":
					return "Write something, or press '/' for commands …";
				case "bulletList":
					return "Bullet list";
				case "orderedList":
					return "Numbered list";
				case "taskList":
					return "Task list";
				case "blockquote":
					return "Quote";
				case "codeBlock":
					return "Write code…";
				case "media":
					return "Click to add a media";
				case "image":
					return "Click to add an image";
				case "video":
					return "Click to add a video";
				case "table":
					return "Table";
				case "tableRow":
					return "Table row";
				case "tableCell":
					return "Table cell";
				case "horizontalRule":
					return "---";
				case "link":
					return "Add a link";
				case "mention":
					return "Mention someone";
				case "tag":
					return "Add a tag";
				case "emoji":
					return "Add an emoji";
				default:
					return "Write something, or press '/' for commands …";
			}
		},
	}),
	TiptapLink.configure({
		HTMLAttributes: {
			class: cn(
				"text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
			),
		},
	}),
	RenderMedia.configure({
		HTMLAttributes: {
			class: cn("rounded-lg border border-muted"),
		},
	}),
	FileHandler.configure({
		allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
		onDrop: (currentEditor, files, pos) => {
			for (const file of files) {
				const fileReader = new FileReader();

				fileReader.readAsDataURL(file);
				fileReader.onload = () => {
					currentEditor
						.chain()
						.insertContentAt(pos, {
							type: "media",
							attrs: { src: fileReader.result },
						})
						.focus()
						.run();
				};
			}
		},
		onPaste: (currentEditor, files, htmlContent) => {
			for (const file of files) {
				if (htmlContent) {
					// if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
					// you could extract the pasted file from this url string and upload it to a server for example
					console.log(htmlContent);
					continue;
				}

				const arrayBufferReader = new FileReader();
				arrayBufferReader.onload = async (e) => {
					const isResultArrayBuffer = e.target?.result instanceof ArrayBuffer;
					if (!isResultArrayBuffer) return;
					const { fileExtension } = getFileStemAndExtension(file.name);
					const imageId = nanoid();
					// const fileName = window.prompt('Enter the file name', `${imageId}`);
					// if (!fileName) return;
					const base64String = encodeArrayBufferToUrlSafeBase64(
						e.target.result,
					);
					const { data: url, error } =
						await actions.assets.uploadImageToCdnAndDb({
							pageId: page.id,
							base64String,
							imageId,
							fileExtension,
						});
					if (error) {
						console.error(error);
						return;
					}
					currentEditor
						.chain()
						.insertContentAt(currentEditor.state.selection.anchor, {
							type: "media",
							attrs: { src: url },
						})
						.focus()
						.run();
				};
				arrayBufferReader.readAsArrayBuffer(file);
			}
		},
	}),
	// UpdatedImage.configure({
	// 	HTMLAttributes: {
	// 		class: cn('rounded-lg border border-muted'),
	// 	},
	// }),
	TaskList.configure({
		HTMLAttributes: {
			class: cn("not-prose pl-2 "),
		},
	}),
	TaskItem.configure({
		HTMLAttributes: {
			class: cn("flex gap-2 items-start my-4"),
		},
		nested: true,
	}),
	HorizontalRule.configure({
		HTMLAttributes: {
			class: cn("mt-4 mb-6 border-t border-muted-foreground"),
		},
	}),
	SlashCommand,
	// MentionPage(extensionServices),
	YouTube,
	EmbedContent,

	GlobalDragHandle.configure({
		dragHandleWidth: 20, // default

		// The scrollThreshold specifies how close the user must drag an element to the edge of the lower/upper screen for automatic
		// scrolling to take place. For example, scrollThreshold = 100 means that scrolling starts automatically when the user drags an
		// element to a position that is max. 99px away from the edge of the screen
		// You can set this to 0 to prevent auto scrolling caused by this extension
		scrollThreshold: 100, // default
	}),
	AutoJoiner.configure({
		elementsToJoin: ["bulletList", "orderedList"], // default
	}),
	CodeBlockLowlight.configure({
		// configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
		// common: covers 37 language grammars which should be good enough in most cases
		lowlight: createLowlight(common),
		defaultLanguage: null,
	}),
	Table.configure({
		HTMLAttributes: {
			class: cn("table-auto w-full"),
		},
	}),
	TableRow.configure({
		HTMLAttributes: {
			class: cn("border border-muted"),
		},
	}),
	TableHeader.configure({
		HTMLAttributes: {
			class: cn("bg-primary text-white font-bold"),
		},
	}),
	TableCell.configure({
		HTMLAttributes: {
			class: cn("border border-muted"),
		},
	}),
	Markdown.configure({
		html: true, // Allow HTML input/output
		tightLists: true, // No <p> inside <li> in markdown output
		tightListClass: "tight", // Add class to <ul> allowing you to remove <p> margins when tight
		bulletListMarker: "-", // <li> prefix in markdown output
		linkify: false, // Create links from "https://..." text
		breaks: false, // New lines (\n) in markdown input are converted to <br>
		transformPastedText: true, // Allow to paste markdown text in the editor
		transformCopiedText: true, // Copied text is transformed to markdown
	}),
];
