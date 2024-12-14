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

	useUpdatePositionReferenceOnEditorSelection({ editor, refs });

	return { refs, floatingStyles, open, setOpen };
}

export function useUpdatePositionReferenceOnEditorSelection<
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
