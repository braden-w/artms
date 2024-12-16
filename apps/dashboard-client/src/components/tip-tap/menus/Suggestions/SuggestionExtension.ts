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
		query,
		editor,
	}: {
		selectedSuggestion: TSuggestion;
		query: string;
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
	const suggestionToolbar = createSuggestionToolbar<TSuggestion, HTMLLIElement>(
		{
			renderSuggestion: (suggestion) => {
				const item = document.createElement("li");
				item.innerHTML = suggestion.title;
				item.className =
					"flex-1 line-clamp-1 text-left cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-sm";
				return item;
			},
		},
	);
	const pluginState = {
		selectedIndex: 0,
		isOpen: false,
		suggestions: [] as TSuggestion[],
		query: "",
	};

	const selectSuggestion = (selectedSuggestion: TSuggestion) => {
		onSuggestionSelected({
			selectedSuggestion,
			query: pluginState.query,
			editor,
		});
		suggestionToolbar.closeSuggestions();
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
						selectSuggestion(selectedSuggestion);
						return true;
					}
				}
				return false;
			},
		},
		view() {
			return {
				update: async (view) => {
					const query = getQuery({
						selection: view.state.selection,
						suggestionTriggerPrefix,
					});

					if (!query) {
						pluginState.isOpen = false;
						suggestionToolbar.closeSuggestions();
						return;
					}

					const suggestions = await getSuggestionsFromQuery(query);
					pluginState.selectedIndex = 0;
					pluginState.isOpen = true;
					pluginState.query = query;
					pluginState.suggestions = suggestions;

					suggestionToolbar.openWithSuggestions({
						suggestions: pluginState.suggestions,
						selectSuggestion,
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

function createSuggestionToolbar<
	TSuggestion,
	SuggestionElement extends HTMLElement,
>({
	renderSuggestion,
}: {
	renderSuggestion: (suggestion: TSuggestion) => SuggestionElement;
}) {
	const element = document.createElement("ul");
	element.className =
		"flex flex-col space-y-1 rounded-md border bg-background p-1 hidden";
	document.body.appendChild(element);

	let stopFloatingUpdate: (() => void) | null = null;

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
		openWithSuggestions({
			suggestions,
			anchor,
			selectSuggestion,
		}: {
			suggestions: TSuggestion[];
			anchor: VirtualElement;
			selectSuggestion: (selectedSuggestion: TSuggestion) => void;
		}) {
			if (suggestions.length === 0) {
				this.closeSuggestions();
				return;
			}
			stopFloatingUpdate = autoUpdate(anchor, element, () => {
				computePosition(anchor, element, {
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
			this.element.innerHTML = "";

			for (const suggestion of suggestions) {
				const item = renderSuggestion(suggestion);
				item.addEventListener("click", () => {
					selectSuggestion(suggestion);
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

function getQuery({
	selection: { $from, from, to },
	suggestionTriggerPrefix,
}: { selection: Selection; suggestionTriggerPrefix: string }) {
	const isCursorSelecting = from !== to;
	if (isCursorSelecting) return null;
	const cursorPos = from;
	const currentLine = $from.doc.textBetween($from.start(), cursorPos);
	const prefixIndex = currentLine.lastIndexOf(suggestionTriggerPrefix);
	if (prefixIndex === -1) return null;
	const query = $from.doc.textBetween(
		$from.start() + prefixIndex + suggestionTriggerPrefix.length,
		cursorPos,
	);
	return query;
}
