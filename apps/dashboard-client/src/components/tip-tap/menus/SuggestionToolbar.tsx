import { Toggle } from "@/components/ui/toggle";
import type { PageFts } from "@repo/dashboard-server/db/schema/pages";
import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { FloatingToolbar } from "./FloatingToolbar";

const SUGGESTION_CHAR = "[[";

const suggestedPages = [
	{ id: "1", title: "Page 1", content: "Content 1" },
	{ id: "2", title: "Page 2", content: "Content 2" },
];

const onPageSelect = (page: PageFts) => {
	console.log(page);
};

export function SuggestionToolbar({ editor }: { editor: Editor }) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!suggestedPages.length) return;

		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			const direction = event.key === "ArrowDown" ? 1 : -1;
			setSelectedIndex(
				(current) =>
					(current + direction + suggestedPages.length) % suggestedPages.length,
			);
		}

		if (event.key === "Enter" && suggestedPages[selectedIndex]) {
			event.preventDefault();
			const selectedPage = suggestedPages[selectedIndex];
			onPageSelect(selectedPage);
		}
	};

	useEffect(() => {
		setSelectedIndex(0);
	}, [suggestedPages]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	});

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
