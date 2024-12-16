import type { Editor } from "@tiptap/react";
import { FloatingToolbar } from "./FloatingToolbar";

const SUGGESTION_CHAR = "[[";

export function SuggestionToolbar({ editor }: { editor: Editor }) {
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
		></FloatingToolbar>
	);
}
