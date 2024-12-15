import type { Editor } from "@tiptap/core";
import { useEditorFloatingToolbar } from "./useFloatingToolbar";
import type { PropsWithChildren } from "react";

export function FloatingToolbar({
	editor,
	shouldShow,
	children,
}: PropsWithChildren<{
	editor: Editor;
	shouldShow: (editor: Editor) => boolean;
}>) {
	const { refs, floatingStyles, isFloatingToolbarOpen, getFloatingProps } =
		useEditorFloatingToolbar({ editor, shouldShow });

	if (!isFloatingToolbarOpen) return null;
	return (
		<div
			ref={refs.setFloating}
			style={floatingStyles}
			{...getFloatingProps()}
			className="z-50 bg-card text-card-foreground shadow-lg rounded-lg p-1"
		>
			{children}
		</div>
	);
}
