import {
	type ExtendedRefs,
	type ReferenceType,
	flip,
	offset,
	shift,
	useFloating,
	useDismiss,
	useInteractions,
} from "@floating-ui/react";
import { isNodeSelection, posToDOMRect } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export function useEditorFloatingMenu({
	editor,
	getShouldFloatingMenuBeVisible,
}: {
	editor: Editor;
	getShouldFloatingMenuBeVisible: (editor: Editor) => boolean;
}) {
	const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		placement: "top",
		middleware: [offset(8), shift(), flip()],
		open: isFloatingMenuOpen,
		onOpenChange: setIsFloatingMenuOpen,
	});
	const dismiss = useDismiss(context, { outsidePress: true });
	const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

	useUpdateFloatingMenuPositionReferenceOnEditorSelection({ editor, refs });
	useUpdateFloatingMenuVisibilityOnEditorSelection({
		editor,
		setIsFloatingMenuOpen,
		getShouldFloatingMenuBeVisible,
	});

	return {
		refs,
		floatingStyles,
		isFloatingMenuOpen,
		getReferenceProps,
		getFloatingProps,
	};
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
	getShouldFloatingMenuBeVisible,
}: {
	editor: Editor;
	setIsFloatingMenuOpen: Dispatch<SetStateAction<boolean>>;
	getShouldFloatingMenuBeVisible: (editor: Editor) => boolean;
}) {
	useEffect(() => {
		const updateFloatingMenuVisibility = () => {
			const shouldFloatingMenuBeVisible =
				getShouldFloatingMenuBeVisible(editor);

			setIsFloatingMenuOpen(shouldFloatingMenuBeVisible);
		};

		editor.on("selectionUpdate", updateFloatingMenuVisibility);

		return () => {
			editor.off("selectionUpdate", updateFloatingMenuVisibility);
		};
	}, [editor, getShouldFloatingMenuBeVisible, setIsFloatingMenuOpen]);
}
