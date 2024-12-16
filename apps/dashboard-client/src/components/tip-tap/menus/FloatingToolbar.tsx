import { Menubar } from "@/components/ui/menubar";
import type { Editor } from "@tiptap/react";
import type { PropsWithChildren } from "react";
import { useEditorFloatingToolbar } from "@epicenterhq/tiptap-extension-floating-toolbar";
import { cn } from "@/lib/utils";

export function FloatingToolbar({
	editor,
	shouldShow,
	className,
	children,
}: PropsWithChildren<{
	editor: Editor;
	shouldShow: (editor: Editor) => boolean;
	className?: string;
}>) {
	const { refs, floatingStyles, isFloatingToolbarOpen, getFloatingProps } =
		useEditorFloatingToolbar({ editor, shouldShow });

	if (!isFloatingToolbarOpen) return null;
	return (
		<Menubar
			ref={refs.setFloating}
			style={floatingStyles}
			{...getFloatingProps()}
			className={cn("h-fit", className)}
		>
			{children}
		</Menubar>
	);
}
