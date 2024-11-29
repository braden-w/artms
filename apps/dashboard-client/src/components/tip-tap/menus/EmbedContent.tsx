import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/router";
import { DEBOUNCE_MS } from "@/routes/pages/-components/RenderValue";
import type { SelectPage } from "@repo/dashboard-server/db/schema/pages";
import { PAGE_LINK_PATTERN } from "@repo/dashboard-server/utils";
import { Node, type NodeViewProps, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TiptapEditor } from "../TiptapEditor";

function NoteEmbedComponent({ node }: NodeViewProps) {
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const { data: page, isPending } = trpc.pages.getPageById.useQuery({
		id: node.attrs.id,
	});
	const { mutate: replacePage } = trpc.pages.replacePage.useMutation();
	const debouncedReplacePage = useDebouncedCallback(
		(page: SelectPage) =>
			replacePage(page, { onSettled: () => setHasUnsavedChanges(false) }),
		DEBOUNCE_MS,
	);

	if (!page) return null;
	return (
		<NodeViewWrapper className="react-component">
			<Card>
				<CardContent>
					<TiptapEditor
						value={page.content ?? ""}
						setValue={(value) => {
							setHasUnsavedChanges(true);
							debouncedReplacePage({ ...page, content: value });
						}}
						page={page}
						saveStatus={hasUnsavedChanges ? "Unsaved" : "Saved"}
					/>
				</CardContent>
			</Card>
		</NodeViewWrapper>
	);
}

type NoteEmbedOptions = {
	HTMLAttributes: Record<string, any>;
};

type SetNoteEmbedOptions = {
	label: string;
	id: string;
};

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		noteEmbed: {
			/**
			 * Insert an embedded note
			 */
			setNoteEmbed: (options: SetNoteEmbedOptions) => ReturnType;
		};
	}
}

export const EmbedContent = Node.create<NoteEmbedOptions>({
	name: "noteEmbed",

	addOptions() {
		return { HTMLAttributes: {} };
	},

	group: "block",

	content: "block+",

	draggable: true,

	atom: true,

	addAttributes() {
		return {
			id: {
				default: null,
			},
			label: {
				default: null,
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'img[src^="/pages/"]',
				getAttrs: (element) => {
					const src = element.getAttribute("src") ?? "";
					const alt = element.getAttribute("alt") ?? "";
					console.log("🚀 ~ parseHTML ~ alt:", alt);
					const pattern = new RegExp(PAGE_LINK_PATTERN);
					const id = src.match(pattern)?.[1] ?? "";
					console.log("🚀 ~ parseHTML ~ id:", id);
					return {
						id: id,
						label: alt,
					};
				},
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ["img", mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return ReactNodeViewRenderer(NoteEmbedComponent);
	},
});
