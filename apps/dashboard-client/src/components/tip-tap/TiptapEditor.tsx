import { createExtensions } from "@/components/tip-tap/extensions";
import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/routes/pages/-components/RenderValue";
import type { SelectPage } from "@repo/dashboard-server/schema";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { LinkMenu } from "./menus/LinkMenu";
import { TextMenu } from "./menus/TextMenu";
import { trpc } from "@/router";

const PROSE_CLASSES = [
	"prose dark:prose-invert",
	"prose-sm sm:prose-base md:prose-lg lg:prose-xl",
	"prose-img:mx-auto prose-img:max-h-[36rem] sm:prose-img:max-h-[48rem]",
	"prose-h1:scroll-m-20 prose-h1:text-4xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:lg:text-5xl",
	"prose-h2:scroll-m-20 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:transition-colors prose-h2:first:mt-0",
	"prose-h3:scroll-m-20 prose-h3:text-2xl prose-h3:font-semibold prose-h3:tracking-tight",
	"prose-h4:scroll-m-20 prose-h4:text-xl prose-h4:font-semibold prose-h4:tracking-tight",
	// 'prose-p:leading-7 prose-p:[&:not(:first-child)]:mt-6',
	// 'prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6',
	"prose-table:my-6 prose-table:w-full prose-table:overflow-y-auto",
	"prose-tr:m-0 prose-tr:border-t prose-tr:p-0 prose-tr:even:bg-muted",
	"prose-th:border prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-bold prose-th:[&[align=center]]:text-center prose-th:[&[align=right]]:text-right",
	"prose-td:border prose-td:px-4 prose-td:py-2 prose-td:text-left prose-td:[&[align=center]]:text-center prose-td:[&[align=right]]:text-right",
	"prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc prose-ul:[&>li]:mt-2",
	// 'prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-code:font-semibold',
] as const;

export function TiptapEditor({
	value,
	setValue,
	saveStatus,
	page,
}: {
	value: string;
	setValue: (newValue: string) => void;
	saveStatus: SaveStatus;
	page: SelectPage;
}) {
	const { mutate: addPage } = trpc.pages.addPage.useMutation();
	const menuContainerRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<HTMLDivElement>(null);
	const editor = useEditor({
		content: value,
		onUpdate: ({ editor }) => {
			const newValue = editor.storage.markdown.getMarkdown() as string;
			const isValueChanged = newValue !== value;
			if (isValueChanged) {
				setValue(newValue);
			}
		},
		autofocus: true,
		extensions: createExtensions({ page, addPage }),
		editorProps: {
			attributes: {
				autocomplete: "off",
				autocorrect: "off",
				autocapitalize: "off",
				class: cn(PROSE_CLASSES, "focus:outline-none max-w-full"),
			},
		},
	});

	useEffect(() => {
		if (editor && editor.storage.markdown.getMarkdown() !== value) {
			editor.commands.setContent(value, false);
		}
	}, [editor, value]);

	if (!editor) return null;
	return (
		<div className="flex h-full" ref={menuContainerRef}>
			<div className="bg-accent text-muted-foreground absolute right-5 top-5 z-10 mb-5 rounded-lg px-2 py-1 text-sm">
				{saveStatus}
			</div>
			<div className="relative flex flex-col flex-1 h-full overflow-hidden">
				<EditorContent
					editor={editor}
					ref={editorRef}
					className="flex-1 overflow-y-auto"
				/>
				{/* <ContentItemMenu editor={editor} /> */}
				<LinkMenu editor={editor} appendTo={menuContainerRef} />
				<TextMenu editor={editor} page={page} />
			</div>
		</div>
	);
}
