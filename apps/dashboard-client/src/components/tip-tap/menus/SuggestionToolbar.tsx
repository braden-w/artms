import { Toggle } from "@/components/ui/toggle";
import type { PageFts } from "@repo/dashboard-server/db/schema/pages";
import type { Editor } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
import { FloatingToolbar } from "./FloatingToolbar";

const SUGGESTION_CHAR = "[[";

const suggestedPages = [
	{ rowid: 1, id: "1", title: "Page 1", content: "Content 1" },
	{ rowid: 2, id: "2", title: "Page 2", content: "Content 2" },
] satisfies PageFts[];

const onPageSelect = (page: PageFts) => {
	console.log(page);
};

const getEditorSelection = (editor: Editor) => {
	const { $from, from, to } = editor.state.selection;
	const isCursorSelecting = from !== to;
	if (isCursorSelecting) return false;
	const currentPosition = from;
	const lineStartPos = $from.start();
	const lineTextBeforeCursor = $from.doc.textBetween(
		lineStartPos,
		currentPosition,
	);
	const triggerCharIndex = lineTextBeforeCursor.lastIndexOf(SUGGESTION_CHAR);
	if (triggerCharIndex === -1) return false;
	const triggerStartPos = lineStartPos + triggerCharIndex;
	const suggestionText = $from.doc.textBetween(
		triggerStartPos + SUGGESTION_CHAR.length,
		currentPosition,
	);
	return suggestionText;
};

export function SuggestionToolbar({ editor }: { editor: Editor }) {
	const suggestionText = getEditorSelection(editor);

	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!suggestionText || !suggestedPages.length) return;
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
			if (selectedPage) onPageSelect(selectedPage);
		}
	};

	useEffect(() => {
		setSelectedIndex(0);
	}, [suggestedPages.length]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	return (
		<FloatingToolbar
			editor={editor}
			shouldShow={(editor) => {
				const { from, to } = editor.state.selection;
				const isCursorInSelection = from !== to;
				if (isCursorInSelection) return false;

				const currentPosition = from;
				const start = Math.max(0, currentPosition - SUGGESTION_CHAR.length);
				const textBefore = editor.state.doc.textBetween(start, currentPosition);
				return textBefore === SUGGESTION_CHAR;
			}}
			className="flex flex-col gap-0.5 p-1 max-h-[280px] overflow-y-auto"
		>
			{suggestedPages.map((page, index) => (
				<Toggle
					key={page.id}
					pressed={index === selectedIndex}
					onPressedChange={() => setSelectedIndex(index)}
				>
					{page.title}
				</Toggle>
			))}
		</FloatingToolbar>
	);
}
