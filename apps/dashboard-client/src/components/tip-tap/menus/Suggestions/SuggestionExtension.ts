import {
	autoUpdate,
	computePosition,
	flip,
	offset,
	shift,
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
			let toolbar: SuggestionToolbar | null = null;
			let cleanup: (() => void) | null = null;

			return {
				update: async (view) => {
					const suggestionText = getSuggestionText({
						selection: view.state.selection,
						suggestionTriggerPrefix,
					});

					if (suggestionText) {
						if (!toolbar) {
							toolbar = createSuggestionToolbar();
							document.body.appendChild(toolbar.element);

							const suggestions = await getSuggestions(suggestionText);
							toolbar.update(suggestions);

							const virtualElement = {
								getBoundingClientRect: () => {
									const { from } = view.state.selection;
									return posToDOMRect(view, from, from);
								},
							};

							cleanup = autoUpdate(
								virtualElement,
								toolbar.element,
								async () => {
									const { x, y, strategy, placement } = await computePosition(
										virtualElement,
										toolbar?.element,
										{
											placement: "top-start",
											middleware: [offset(8), flip(), shift()],
										},
									);

									Object.assign(toolbar?.element.style, {
										position: strategy,
										left: `${x}px`,
										top: `${y}px`,
										zIndex: "9999",
										width: "max-content",
										transformOrigin: placement.includes("top")
											? "bottom"
											: "top",
									});
								},
							);
						}
					} else {
						if (cleanup) {
							cleanup();
							cleanup = null;
						}
						if (toolbar) {
							toolbar.destroy();
							toolbar = null;
						}
					}
				},
				destroy: () => {
					if (cleanup) cleanup();
					if (toolbar) toolbar.destroy();
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

function createSuggestionToolbar() {
	const toolbar = document.createElement("div");
	toolbar.className = "suggestion-toolbar";

	const list = document.createElement("ul");
	list.className = "suggestion-list";
	toolbar.appendChild(list);

	return {
		element: toolbar,
		update(suggestions: SuggestedPage[]) {
			list.innerHTML = "";
			for (const suggestion of suggestions) {
				const item = document.createElement("li");
				item.textContent = suggestion.title;
				item.addEventListener("click", () => {
					// Handle selection
				});
				list.appendChild(item);
			}
		},
		destroy() {
			toolbar.remove();
		},
	};
}
