import type { ExtendedRefs, ReferenceType } from "@floating-ui/react";
import { flip, offset, shift, useFloating } from "@floating-ui/react";
import { isNodeSelection, posToDOMRect } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export function useEditorFloatingMenu({ editor }: { editor: Editor }) {
	const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

	const { floatingStyles, refs } = useFloating({
		placement: "top",
		middleware: [offset(8), shift(), flip()],
	});

	useUpdateFloatingMenuPositionReferenceOnEditorSelection({ editor, refs });
	useUpdateFloatingMenuVisibilityOnEditorSelection({
		editor,
		setIsFloatingMenuOpen,
	});
	useCloseFloatingMenuOnBlur({ editor, setIsFloatingMenuOpen });

	return { refs, floatingStyles, isFloatingMenuOpen };
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
	setIsFloatingMenuOpen,
}: {
	editor: Editor;
	setIsFloatingMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
	useEffect(() => {
		const updateFloatingMenuVisibility = () => {
			const shouldFloatingMenuBeVisible = (() => {
				const { state } = editor;
				const { empty: isSelectionEmpty, from, to } = state.selection;
				const isEmptyTextBlock = !state.doc.textBetween(from, to).length;
				return !isSelectionEmpty && !isEmptyTextBlock && editor.isEditable;
			})();

			setIsFloatingMenuOpen(shouldFloatingMenuBeVisible);
		};

		editor.on("selectionUpdate", updateFloatingMenuVisibility);

		return () => {
			editor.off("selectionUpdate", updateFloatingMenuVisibility);
		};
	}, [editor, setIsFloatingMenuOpen]);
}

function useCloseFloatingMenuOnBlur({
	editor,
	setIsFloatingMenuOpen,
}: {
	editor: Editor;
	setIsFloatingMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
	useEffect(() => {
		editor.on("blur", () => setIsFloatingMenuOpen(false));
		return () => {
			editor.off("blur", () => setIsFloatingMenuOpen(false));
		};
	}, [editor, setIsFloatingMenuOpen]);
}
