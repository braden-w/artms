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

export function useEditorFloatingToolbar({
	editor,
	shouldShow,
}: {
	editor: Editor;
	shouldShow: (editor: Editor) => boolean;
}) {
	const [isFloatingToolbarOpen, setIsFloatingToolbarOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		placement: "top",
		middleware: [offset(8), shift(), flip()],
		open: isFloatingToolbarOpen,
		onOpenChange: setIsFloatingToolbarOpen,
	});
	const dismiss = useDismiss(context, { outsidePress: true });
	const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

	useUpdateFloatingToolbarPositionReferenceOnEditorSelection({ editor, refs });
	useUpdateFloatingToolbarVisibilityOnEditorSelection({
		editor,
		setIsFloatingToolbarOpen,
		shouldShow,
	});

	return {
		refs,
		floatingStyles,
		isFloatingToolbarOpen,
		getReferenceProps,
		getFloatingProps,
	};
}

function useUpdateFloatingToolbarPositionReferenceOnEditorSelection<
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

function useUpdateFloatingToolbarVisibilityOnEditorSelection({
	editor,
	setIsFloatingToolbarOpen,
	shouldShow,
}: {
	editor: Editor;
	setIsFloatingToolbarOpen: Dispatch<SetStateAction<boolean>>;
	shouldShow: (editor: Editor) => boolean;
}) {
	useEffect(() => {
		const updateFloatingToolbarVisibility = () => {
			const shouldFloatingToolbarBeVisible = shouldShow(editor);

			setIsFloatingToolbarOpen(shouldFloatingToolbarBeVisible);
		};

		editor.on("selectionUpdate", updateFloatingToolbarVisibility);

		return () => {
			editor.off("selectionUpdate", updateFloatingToolbarVisibility);
		};
	}, [editor, shouldShow, setIsFloatingToolbarOpen]);
}
