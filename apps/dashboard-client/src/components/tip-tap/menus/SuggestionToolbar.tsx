import { Toggle } from "@/components/ui/toggle";
import type { PageFts } from "@repo/dashboard-server/db/schema/pages";
import type { Editor } from "@tiptap/react";
import { FloatingToolbar } from "./FloatingToolbar";

const SUGGESTION_CHAR = "[[";

export function SuggestionToolbar({
	editor,
	suggestedPages,
}: {
	editor: Editor;
	suggestedPages: PageFts[];
}) {
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
			className="flex flex-col"
		>
			{suggestedPages.map((page) => (
				<Toggle key={page.id}>{page.title}</Toggle>
			))}
		</FloatingToolbar>
	);
}
