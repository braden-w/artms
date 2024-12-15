import { TiptapIcon } from "@/components/tip-tap/ui/Icon";
import { Surface } from "@/components/tip-tap/ui/Surface";
import { Toolbar } from "@/components/tip-tap/ui/Toolbar";
import Tooltip from "@/components/tip-tap/ui/Tooltip";
import { Button } from "@/components/ui/button";
import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { useEditorFloatingMenu } from "./useFloatingMenu";
import { Separator } from "@/components/ui/separator";

export function FloatingLinkToolbar({
	editor,
}: {
	editor: Editor;
}) {
	const [isShowEdit, setIsShowEdit] = useState(false);
	const { refs, floatingStyles, isFloatingMenuOpen } = useEditorFloatingMenu({
		editor,
		getShouldFloatingMenuBeVisible: (editor) => editor.isActive("link"),
	});
	const { href: initialUrl, target } = editor.getAttributes("link");
	const { title: initialTitle } = editor.getAttributes("text");
	if (!isFloatingMenuOpen) return null;
	return (
		<div
			ref={refs.setFloating}
			style={floatingStyles}
			className="z-50 bg-card text-card-foreground shadow-lg rounded-lg p-1"
		>
			{isShowEdit ? (
				<LinkEditorPanel
					initialTitle={initialTitle}
					initialUrl={initialUrl}
					onSetUrl={({ title, url }) => {
						editor
							.chain()
							.focus()
							.extendMarkRange("link")
							.setLink({ href: url, target: "_blank" })
							.updateAttributes("link", { title })
							.setTextSelection(editor.state.selection.from)
							.insertContent(title)
							.run();
					}}
				/>
			) : (
				<LinkPreviewPanel
					url={initialUrl}
					onRemoveUrl={() => {
						editor.chain().focus().extendMarkRange("link").unsetLink().run();
						setIsShowEdit(false);
						return null;
					}}
					onOpenLinkEditor={() => setIsShowEdit(true)}
				/>
			)}
		</div>
	);
}

function LinkPreviewPanel({
	url,
	onRemoveUrl,
	onOpenLinkEditor,
}: {
	url: string;
	onOpenLinkEditor: () => void;
	onRemoveUrl: () => void;
}) {
	return (
		<Surface className="flex items-center gap-2 p-2">
			<Button variant="link" size="sm" asChild>
				<a href={url} target="_blank" rel="noopener noreferrer">
					{url}
				</a>
			</Button>
			<Separator orientation="vertical" className="mx-1" />
			<Tooltip title="Edit link">
				<Button variant="ghost" size="icon" onClick={onOpenLinkEditor}>
					<TiptapIcon name="Pen" />
				</Button>
			</Tooltip>
			<Tooltip title="Remove link">
				<Button variant="ghost" size="icon" onClick={onRemoveUrl}>
					<TiptapIcon name="Trash2" />
				</Button>
			</Tooltip>
		</Surface>
	);
}

function LinkEditorPanel({
	initialTitle,
	initialUrl,
	onSetUrl,
}: {
	initialTitle?: string;
	initialUrl?: string;
	onSetUrl: (url: { title: string; url: string }) => void;
}) {
	const [title, setTitle] = useState(initialTitle || "");
	const [url, setUrl] = useState(initialUrl || "");
	// const isValidUrl = /^(\S+):(\/\/)?\S+|\/\S+$/.test(url);
	const isValidUrl = true;
	return (
		<Surface className="p-2">
			<form
				onSubmit={(e: React.FormEvent) => {
					e.preventDefault();
					if (isValidUrl) onSetUrl({ title, url });
				}}
				className="flex items-center gap-2"
			>
				<label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-text">
					<TiptapIcon
						name="Link"
						className="flex-none text-black dark:text-white"
					/>
					<input
						className="flex-1 bg-transparent outline-none min-w-[12rem] text-black text-sm dark:text-white"
						placeholder="Enter Title"
						value={title}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setTitle(event.target.value);
						}}
					/>
					<input
						className="flex-1 bg-transparent outline-none min-w-[12rem] text-black text-sm dark:text-white"
						placeholder="Enter URL"
						value={url}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setUrl(event.target.value);
						}}
					/>
				</label>
				<Button size="sm" type="submit" disabled={!isValidUrl}>
					Set Link
				</Button>
			</form>
		</Surface>
	);
}
