import type { ExtendedRefs, ReferenceType } from "@floating-ui/react";
import { isNodeSelection, posToDOMRect } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from "@floating-ui/react";

export function useFloatingMenu({ editor }: { editor: Editor }) {
	const [open, setOpen] = useState(false);

	const { floatingStyles, refs } = useFloating({
		placement: "top",
		middleware: [offset(8), shift(), flip()],
		whileElementsMounted: autoUpdate,
		strategy: "fixed",
	});

	useUpdateFloatingMenuPositionReferenceOnEditorSelection({ editor, refs });
	useUpdateFloatingMenuVisibilityOnEditorSelection({ editor, setOpen });
	useCloseFloatingMenuOnBlur({ editor, setOpen });

	return { refs, floatingStyles, open, setOpen };
}

function useUpdateFloatingMenuPositionReferenceOnEditorSelection<
	RT extends ReferenceType = ReferenceType,
>({ editor, refs }: { editor: Editor; refs: ExtendedRefs<RT> }) {
	useEffect(() => {
		const updatePosition = () => {
			const virtualElement = {
				...editor.view.dom,
				getBoundingClientRect: () => {
					const { state } = editor;
					const { from, to } = state.selection;

					if (isNodeSelection(state.selection)) {
						const node = editor.view.nodeDOM(from) as HTMLElement;
						if (node) return node.getBoundingClientRect();
					}

					return posToDOMRect(editor.view, from, to);
				},
			} satisfies Element;

			refs.setPositionReference(virtualElement);
		};

		editor.on("selectionUpdate", updatePosition);
		return () => {
			editor.off("selectionUpdate", updatePosition);
		};
	}, [editor, refs]);
}

function useUpdateFloatingMenuVisibilityOnEditorSelection({
	editor,
	setOpen,
}: {
	editor: Editor;
	setOpen: (open: boolean) => void;
}) {
	useEffect(() => {
		const updateFloatingMenuVisibility = () => {
			const shouldFloatingMenuBeVisible = (() => {
				const { state } = editor;
				const { empty: isSelectionEmpty, from, to } = state.selection;
				const isEmptyTextBlock = !state.doc.textBetween(from, to).length;
				return !isSelectionEmpty && !isEmptyTextBlock && editor.isEditable;
			})();

			setOpen(shouldFloatingMenuBeVisible);
		};

		editor.on("selectionUpdate", updateFloatingMenuVisibility);

		return () => {
			editor.off("selectionUpdate", updateFloatingMenuVisibility);
		};
	}, [editor, setOpen]);
}

function useCloseFloatingMenuOnBlur({
	editor,
	setOpen,
}: { editor: Editor; setOpen: (open: boolean) => void }) {
	useEffect(() => {
		editor.on("blur", () => setOpen(false));
		return () => {
			editor.off("blur", () => setOpen(false));
		};
	}, [editor, setOpen]);
}
