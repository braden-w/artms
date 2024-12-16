import { Toggle } from "@/components/ui/toggle";
import { trpc } from "@/router";
import { generateDefaultPage } from "@repo/dashboard-server/utils";
import type { Editor } from "@tiptap/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FloatingToolbar } from "./FloatingToolbar";

const SUGGESTION_TRIGGER_PREFIX = "[[";

export function SuggestionToolbar({ editor }: { editor: Editor }) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [suggestionText, setSuggestionText] = useState("");
	const { data: suggestedPagesFromDb, isLoading: isLoadingSuggestedPages } =
		trpc.pages.getPagesByFts.useQuery(
			{ query: suggestionText },
			{ enabled: !!suggestionText },
		);

	const newPage = generateDefaultPage({ title: suggestionText });
	const suggestedPages = [...(suggestedPagesFromDb ?? []), newPage];

	const { mutate: addPage, isPending: isAddingPage } =
		trpc.pages.addPage.useMutation();

	const handleKeyDown = (event: KeyboardEvent) => {
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
				const cleanedTitle = stripHtml(selectedPage.title ?? "");
				const { $from } = editor.state.selection;
				const currentPos = $from.pos;
				const startPos =
					currentPos -
					(suggestionText.length + SUGGESTION_TRIGGER_PREFIX.length);

				editor
					.chain()
					.focus()
					.deleteRange({ from: startPos, to: currentPos })
					.insertContent({
						type: "text",
						marks: [
							{
								type: "link",
								attrs: {
									href: `/pages/${selectedPage.id}`,
									target: "_blank",
								},
							},
						],
						text: cleanedTitle,
					})
					.run();
			}
		}
	};

	useEffect(() => {
		if (suggestedPages.length) setSelectedIndex(0);
	}, [suggestedPages.length]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	return (
		<FloatingToolbar
			editor={editor}
			shouldShow={(editor) => {
				const suggestionText = getSuggestionText(editor);
				if (suggestionText) setSuggestionText(suggestionText);
				return !!suggestionText;
			}}
			className="w-96 flex flex-col gap-0.5 p-1 max-h-[280px] overflow-y-auto"
		>
			{isLoadingSuggestedPages ? (
				<div className="flex-1 flex items-center justify-center">
					<Loader2 className="h-4 w-4 animate-spin" />
				</div>
			) : (
				suggestedPages?.map((page, index) => (
					<Toggle
						key={page.id}
						pressed={index === selectedIndex}
						onPressedChange={() => setSelectedIndex(index)}
						className="w-full line-clamp-1 text-left"
						dangerouslySetInnerHTML={{ __html: page.title ?? "" }}
					/>
				))
			)}
		</FloatingToolbar>
	);
}

function getSuggestionText(editor: Editor) {
	const { $from, from, to } = editor.state.selection;
	const isCursorSelecting = from !== to;
	if (isCursorSelecting) return null;
	const cursorPos = from;
	const currentLine = $from.doc.textBetween($from.start(), cursorPos);
	const prefixIndex = currentLine.lastIndexOf(SUGGESTION_TRIGGER_PREFIX);
	if (prefixIndex === -1) return null;
	const suggestionText = $from.doc.textBetween(
		$from.start() + prefixIndex + SUGGESTION_TRIGGER_PREFIX.length,
		cursorPos,
	);
	return suggestionText;
}

function stripHtml(strInputCode: string) {
	const div = document.createElement("div");
	div.innerHTML = strInputCode;
	return div.textContent ?? div.innerText;
}
