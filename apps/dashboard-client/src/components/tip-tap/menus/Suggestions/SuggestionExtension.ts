import {
	autoUpdate,
	computePosition,
	flip,
	inline,
	limitShift,
	offset,
	ReferenceElement,
	shift,
	VirtualElement,
} from "@floating-ui/dom";
import { type Editor, Extension, posToDOMRect } from "@tiptap/core";
import {
	type Selection,
	type EditorState,
	Plugin,
	PluginKey,
} from "@tiptap/pm/state";
import type { SuggestedPage } from "../SuggestionToolbar";

const PLUGIN_NAME = "suggestion";

type SuggestionOptions = {
	suggestionTriggerPrefix: string;
	getSuggestions: (query: string) => Promise<SuggestedPage[]>;
	onSuggestionSelected: ({
		selectedSuggestion,
		suggestionText,
		editor,
	}: {
		selectedSuggestion: SuggestedPage;
		suggestionText: string;
		editor: Editor;
	}) => void;
};

export const SuggestionExtension = Extension.create<SuggestionOptions>({
	name: PLUGIN_NAME,

	addProseMirrorPlugins() {
		const editor = this.editor;
		return [SuggestionPlugin(editor, this.options)];
	},
});

function SuggestionPlugin(
	editor: Editor,
	{
		suggestionTriggerPrefix,
		getSuggestions,
		onSuggestionSelected,
	}: SuggestionOptions,
) {
	return new Plugin({
		key: new PluginKey(PLUGIN_NAME),
		view: () => {
			const suggestionToolbar = createSuggestionToolbar();
			suggestionToolbar.mount();

			return {
				update: async (view) => {
					const suggestionText = getSuggestionText({
						selection: view.state.selection,
						suggestionTriggerPrefix,
					});

					if (!suggestionText) {
						suggestionToolbar.close();
						return;
					}

					suggestionToolbar.open({
						getBoundingClientRect: () => {
							const { from } = view.state.selection;
							return posToDOMRect(view, from, from);
						},
						getClientRects: () => {
							const { from } = view.state.selection;
							return [posToDOMRect(view, from, from)];
						},
					});
					const suggestions = await getSuggestions(suggestionText);
					suggestionToolbar.update(suggestions);
				},
				destroy: () => {
					suggestionToolbar.destroy();
				},
			};
		},
	});
}

function getSuggestionText({
	selection: { $from, from, to },
	suggestionTriggerPrefix,
}: { selection: Selection; suggestionTriggerPrefix: string }) {
	const isCursorSelecting = from !== to;
	if (isCursorSelecting) return null;
	const cursorPos = from;
	const currentLine = $from.doc.textBetween($from.start(), cursorPos);
	const prefixIndex = currentLine.lastIndexOf(suggestionTriggerPrefix);
	if (prefixIndex === -1) return null;
	const suggestionText = $from.doc.textBetween(
		$from.start() + prefixIndex + suggestionTriggerPrefix.length,
		cursorPos,
	);
	return suggestionText;
}

type SuggestionToolbar = ReturnType<typeof createSuggestionToolbar>;

function createSuggestionToolbar(referenceElement: VirtualElement) {
	let isVisible = false;

	const toolbarShell = document.createElement("ul");
	toolbarShell.className =
		"flex flex-col space-y-1 rounded-md border bg-background p-1 hidden";
	document.body.appendChild(toolbarShell);

	const removeAutoUpdatePosition = autoUpdate(
		referenceElement,
		toolbarShell,
		() => {
			if (!toolbarShell) return;

			computePosition(referenceElement, toolbarShell, {
				placement: "top-start",
				middleware: [
					inline(),
					offset(8),
					flip({ padding: 8 }),
					shift({ padding: 8, limiter: limitShift() }),
				],
			}).then(({ x, y, strategy }) => {
				if (!toolbarShell) return;
				Object.assign(toolbarShell.style, {
					position: strategy,
					left: `${x}px`,
					top: `${y}px`,
				});
			});
		},
	);

	return {
		open() {
			if (isVisible) return;
			toolbarShell.classList.remove("hidden");
			isVisible = true;
		},

		close() {
			if (!isVisible) return;
			toolbarShell.classList.add("hidden");
			isVisible = false;
		},

		destroy() {
			removeAutoUpdatePosition();
			toolbarShell.remove();
			isVisible = false;
		},

		update(suggestions: SuggestedPage[]) {
			if (!toolbarShell) return;

			toolbarShell.innerHTML = "";
			for (const suggestion of suggestions) {
				const item = document.createElement("li");
				item.textContent = suggestion.title;
				item.className =
					"flex-1 line-clamp-1 text-left cursor-pointer hover:bg-accent";
				item.addEventListener("click", () => {
					// Handle selection
				});
				toolbarShell.appendChild(item);
			}
		},
	};
}
