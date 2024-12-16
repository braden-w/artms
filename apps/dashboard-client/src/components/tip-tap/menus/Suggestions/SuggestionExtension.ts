import {
	ReferenceElement,
	VirtualElement,
	autoUpdate,
	computePosition,
	flip,
	inline,
	limitShift,
	offset,
	shift,
} from "@floating-ui/dom";
import { type Editor, Extension, posToDOMRect } from "@tiptap/core";
import { Plugin, PluginKey, type Selection } from "@tiptap/pm/state";
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

			const openSuggestions = ({
				suggestions,
				anchor,
			}: {
				suggestions: SuggestedPage[];
				anchor: VirtualElement;
			}) => {
				if (suggestions.length === 0) {
					suggestionToolbar.close();
					return;
				}
				suggestionToolbar.open(anchor);
				suggestionToolbar.element.innerHTML = "";
				for (const suggestion of suggestions) {
					const item = document.createElement("li");
					item.textContent = suggestion.title;
					item.className =
						"flex-1 line-clamp-1 text-left cursor-pointer hover:bg-accent";
					item.addEventListener("click", () => {
						// Handle selection
					});
					suggestionToolbar.element.appendChild(item);
				}
			};

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

					const suggestions = await getSuggestions(suggestionText);
					openSuggestions({
						suggestions,
						anchor: {
							getBoundingClientRect: () => {
								const { from } = view.state.selection;
								return posToDOMRect(view, from, from);
							},
							getClientRects: () => {
								const { from } = view.state.selection;
								return [posToDOMRect(view, from, from)];
							},
						},
					});
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

function createSuggestionToolbar() {
	const element = document.createElement("ul");
	element.className =
		"flex flex-col space-y-1 rounded-md border bg-background p-1 hidden";
	document.body.appendChild(element);

	let cleanup: (() => void) | null = null;

	return {
		element,
		open(referenceElement: ReferenceElement) {
			cleanup = autoUpdate(referenceElement, element, () => {
				computePosition(referenceElement, element, {
					placement: "top-start",
					middleware: [
						inline(),
						offset(8),
						flip({ padding: 8 }),
						shift({ padding: 8, limiter: limitShift() }),
					],
				}).then(({ x, y, strategy }) => {
					Object.assign(element.style, {
						position: strategy,
						left: `${x}px`,
						top: `${y}px`,
					});
				});
			});
			element.classList.remove("hidden");
		},
		close() {
			cleanup?.();
			element.classList.add("hidden");
		},
		destroy() {
			cleanup?.();
			element.remove();
		},
	};
}
