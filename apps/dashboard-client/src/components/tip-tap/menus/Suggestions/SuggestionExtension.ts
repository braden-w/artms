import type { ReferenceElement, VirtualElement } from "@floating-ui/dom";
import {
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

type SuggestionOptions<TSuggestion> = {
	suggestionTriggerPrefix: string;
	getSuggestionsFromQuery: (query: string) => Promise<TSuggestion[]>;
	onSuggestionSelected: ({
		selectedSuggestion,
		suggestionText,
		editor,
	}: {
		selectedSuggestion: TSuggestion;
		suggestionText: string;
		editor: Editor;
	}) => void;
};

export const SuggestionExtension = Extension.create<
	SuggestionOptions<SuggestedPage>
>({
	name: PLUGIN_NAME,

	addProseMirrorPlugins() {
		const editor = this.editor;
		return [SuggestionPlugin(editor, this.options)];
	},
});

function SuggestionPlugin<TSuggestion>(
	editor: Editor,
	{
		suggestionTriggerPrefix,
		getSuggestionsFromQuery,
		onSuggestionSelected,
	}: SuggestionOptions<TSuggestion>,
) {
	const suggestionToolbar = createSuggestionToolbar();
	let pluginState = {
		selectedIndex: 0,
		isOpen: false,
		suggestions: [] as TSuggestion[],
	};

	return new Plugin({
		key: new PluginKey(PLUGIN_NAME),
		props: {
			handleKeyDown(view, event) {
				if (!pluginState.isOpen || pluginState.suggestions.length === 0) {
					return false;
				}

				switch (event.key) {
					case "ArrowDown": {
						event.preventDefault();
						pluginState.selectedIndex =
							(pluginState.selectedIndex + 1) % pluginState.suggestions.length;
						suggestionToolbar.updateSelectedStyles(pluginState.selectedIndex);
						return true;
					}
					case "ArrowUp": {
						event.preventDefault();
						pluginState.selectedIndex =
							(pluginState.selectedIndex - 1 + pluginState.suggestions.length) %
							pluginState.suggestions.length;
						suggestionToolbar.updateSelectedStyles(pluginState.selectedIndex);
						return true;
					}
					case "Enter": {
						event.preventDefault();
						const selectedSuggestion =
							pluginState.suggestions[pluginState.selectedIndex];
						if (selectedSuggestion) {
							const suggestionText = getSuggestionText({
								selection: view.state.selection,
								suggestionTriggerPrefix,
							});
							onSuggestionSelected({
								selectedSuggestion,
								suggestionText: suggestionText || "",
								editor,
							});
							suggestionToolbar.closeSuggestions();
						}
						return true;
					}
				}
				return false;
			},
		},
		view() {
			return {
				update: async (view) => {
					const suggestionText = getSuggestionText({
						selection: view.state.selection,
						suggestionTriggerPrefix,
					});

					if (!suggestionText) {
						pluginState.isOpen = false;
						suggestionToolbar.closeSuggestions();
						return;
					}

					const suggestions = await getSuggestionsFromQuery(suggestionText);
					pluginState = { selectedIndex: 0, isOpen: true, suggestions };

					suggestionToolbar.openWithSuggestions({
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
				destroy() {
					suggestionToolbar.destroy();
				},
			};
		},
	});
}

function createSuggestionToolbar() {
	const element = document.createElement("ul");
	element.className =
		"flex flex-col space-y-1 rounded-md border bg-background p-1 hidden";
	document.body.appendChild(element);

	let stopFloatingUpdate: (() => void) | null = null;

	const openSuggestions = (referenceElement: ReferenceElement) => {
		stopFloatingUpdate = autoUpdate(referenceElement, element, () => {
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
	};

	return {
		element,
		updateSelectedStyles(selectedIndex: number) {
			Array.from(element.children).forEach((child, index) => {
				if (index === selectedIndex) {
					child.classList.add("bg-accent", "text-accent-foreground");
				} else {
					child.classList.remove("bg-accent", "text-accent-foreground");
				}
			});
		},
		openWithSuggestions<TSuggestion>({
			suggestions,
			anchor,
		}: {
			suggestions: TSuggestion[];
			anchor: VirtualElement;
		}) {
			if (suggestions.length === 0) {
				this.closeSuggestions();
				return;
			}
			openSuggestions(anchor);
			this.element.innerHTML = "";

			for (const suggestion of suggestions) {
				const item = document.createElement("li");
				item.textContent = suggestion.title;
				item.className =
					"flex-1 line-clamp-1 text-left cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-sm";
				item.addEventListener("click", () => {
					// Handle selection
				});
				this.element.appendChild(item);
			}

			this.updateSelectedStyles(0);
		},
		closeSuggestions() {
			stopFloatingUpdate?.();
			element.classList.add("hidden");
		},
		destroy() {
			stopFloatingUpdate?.();
			element.remove();
		},
	};
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
