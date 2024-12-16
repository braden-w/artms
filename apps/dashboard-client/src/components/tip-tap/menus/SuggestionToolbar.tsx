import { Toggle } from "@/components/ui/toggle";
import type { PageFts } from "@repo/dashboard-server/db/schema/pages";
import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { FloatingToolbar } from "./FloatingToolbar";
import { trpc } from "@/router";
import { Loader2 } from "lucide-react";
import { generateDefaultPage } from "@repo/dashboard-server/utils";
import type { StringWithHtmlFragments } from "@repo/dashboard-server/services/index";

const SUGGESTION_CHAR = "[[";

export function SuggestionToolbar({ editor }: { editor: Editor }) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [suggestionText, setSuggestionText] = useState("");
	const { data: pagesByFts, isPending } = trpc.pages.getPagesByFts.useQuery(
		{ query: suggestionText },
		{ enabled: !!suggestionText },
	);

	const newPage = generateDefaultPage({ title: suggestionText });

	const suggestedPages = [...(pagesByFts ?? []), newPage];

	const { mutate: addPage, isPending: isAddingPage } =
		trpc.pages.addPage.useMutation();

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!suggestedPages?.length) return;
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			const direction = event.key === "ArrowDown" ? 1 : -1;
			setSelectedIndex(
				(current) =>
					(current + direction + suggestedPages.length) % suggestedPages.length,
			);
		}

		if (event.key === "Enter") {
			event.preventDefault();
			const selectedPage = suggestedPages[selectedIndex];

			if (selectedPage) {
				if (selectedPage.id === newPage.id) {
					addPage(newPage);
				}
				const cleanedTitle = stripHtml(selectedPage.title);
				const pageLink =
					`[${cleanedTitle}](/pages/${selectedPage.id})` as const;
				editor.chain().focus().insertContent(pageLink).run();
			}
		}
	};

	useEffect(() => {
		setSelectedIndex(0);
	}, [suggestedPages?.length]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<FloatingToolbar
			editor={editor}
			shouldShow={(editor) => {
				const { suggestionText, isSuggesting } = getEditorSelection(editor);
				if (suggestionText) setSuggestionText(suggestionText);
				return isSuggesting;
			}}
			className="flex flex-col gap-0.5 p-1 max-h-[280px] overflow-y-auto"
		>
			{isPending ? (
				<div className="flex-1 flex items-center justify-center">
					<Loader2 className="h-4 w-4 animate-spin" />
				</div>
			) : (
				suggestedPages?.map((page, index) => (
					<Toggle
						key={page.id}
						pressed={index === selectedIndex}
						onPressedChange={() => setSelectedIndex(index)}
					>
						{page.title}
					</Toggle>
				))
			)}
		</FloatingToolbar>
	);
}

function getEditorSelection(editor: Editor) {
	const { $from, from, to } = editor.state.selection;
	const isCursorSelecting = from !== to;
	if (isCursorSelecting)
		return { suggestionText: "", isSuggesting: false } as const;
	const currentPosition = from;
	const lineStartPos = $from.start();
	const lineTextBeforeCursor = $from.doc.textBetween(
		lineStartPos,
		currentPosition,
	);
	const triggerCharIndex = lineTextBeforeCursor.lastIndexOf(SUGGESTION_CHAR);
	if (triggerCharIndex === -1)
		return { suggestionText: "", isSuggesting: false } as const;
	const triggerStartPos = lineStartPos + triggerCharIndex;
	const suggestionText = $from.doc.textBetween(
		triggerStartPos + SUGGESTION_CHAR.length,
		currentPosition,
	);
	return { suggestionText, isSuggesting: true } as const;
}

function stripHtml(strInputCode: StringWithHtmlFragments) {
	const div = document.createElement("div");
	div.innerHTML = strInputCode;
	return div.textContent ?? div.innerText;
}
