import { Menubar } from "@/components/ui/menubar";
import type { Editor } from "@tiptap/react";
import type { PropsWithChildren } from "react";
import { useEditorFloatingToolbar } from "./useFloatingToolbar";

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
		<Menubar
			ref={refs.setFloating}
			style={floatingStyles}
			{...getFloatingProps()}
			className="h-fit"
		>
			{children}
		</Menubar>
	);
}
