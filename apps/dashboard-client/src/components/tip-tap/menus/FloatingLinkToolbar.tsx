import { TiptapIcon } from "@/components/tip-tap/ui/Icon";
import { Surface } from "@/components/tip-tap/ui/Surface";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Editor } from "@tiptap/react";
import { Fragment, useState } from "react";
import { useEditorFloatingToolbar } from "./useFloatingToolbar";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function FloatingLinkToolbar({
	editor,
}: {
	editor: Editor;
}) {
	const [isShowEdit, setIsShowEdit] = useState(false);
	const { refs, floatingStyles, isFloatingToolbarOpen, getFloatingProps } =
		useEditorFloatingToolbar({
			editor,
			shouldShow: (editor) => editor.isActive("link"),
		});
	const { href: initialUrl, target } = editor.getAttributes("link");
	const { title: initialTitle } = editor.getAttributes("text");
	if (!isFloatingToolbarOpen) return null;
	return (
		<div
			ref={refs.setFloating}
			style={floatingStyles}
			{...getFloatingProps()}
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
		<Fragment>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								buttonVariants({ variant: "link" }),
								"break-all min-w-32",
							)}
						>
							{url}
						</a>
					</TooltipTrigger>
					<TooltipContent>Open link</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Separator orientation="vertical" className="mx-1" />

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button variant="ghost" size="icon" onClick={onOpenLinkEditor}>
							<TiptapIcon name="Pen" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Edit link</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button variant="ghost" size="icon" onClick={onRemoveUrl}>
							<TiptapIcon name="Trash2" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Remove link</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</Fragment>
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
