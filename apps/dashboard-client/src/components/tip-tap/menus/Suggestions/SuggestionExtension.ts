import type { VirtualElement } from "@floating-ui/dom";
import {
	autoUpdate,
	computePosition,
	flip,
	inline,
	limitShift,
	offset,
	shift,
} from "@floating-ui/dom";
import { Extension, posToDOMRect } from "@tiptap/core";
import { Plugin, PluginKey, type Selection } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import type { SuggestedPage } from "../SuggestionToolbar";

const PLUGIN_NAME = "suggestion";

type SuggestionItem = { title: string };

type SuggestionOptions<
	TSuggestion extends SuggestionItem,
	ToolbarWrapperElement extends HTMLElement,
	SuggestionItemElement extends HTMLElement,
> = {
	suggestionTriggerPrefix: string;
	getSuggestionsFromQuery: (query: string) => Promise<TSuggestion[]>;
	onSuggestionSelected: ({
		selectedSuggestion,
		query,
		view,
	}: {
		selectedSuggestion: TSuggestion;
		query: string;
		view: EditorView;
	}) => void;
	toolbarWrapper: {
		mount: () => ToolbarWrapperElement;
		show: (element: ToolbarWrapperElement) => void;
		hide: (element: ToolbarWrapperElement) => void;
	};
	suggestionItem: {
		mount: (suggestion: TSuggestion) => SuggestionItemElement;
		updateSelected: (
			element: SuggestionItemElement,
			isSelected: boolean,
		) => void;
	};
};

export const SuggestionExtension = Extension.create<
	SuggestionOptions<SuggestedPage, HTMLUListElement, HTMLLIElement>
>({
	name: PLUGIN_NAME,
	addProseMirrorPlugins() {
		return [SuggestionPlugin(this.options)];
	},
});

function SuggestionPlugin<
	TSuggestion extends SuggestionItem,
	ToolbarWrapperElement extends HTMLElement,
	SuggestionItemElement extends HTMLElement,
>(
	options: SuggestionOptions<
		TSuggestion,
		ToolbarWrapperElement,
		SuggestionItemElement
	>,
) {
	const {
		suggestionTriggerPrefix,
		getSuggestionsFromQuery,
		onSuggestionSelected,
	} = options;
	const suggestionToolbar = createSuggestionToolbar(options);

	const pluginState = {
		selectedIndex: 0,
		isOpen: false,
		suggestions: [] as TSuggestion[],
		query: "",
	};

	const selectSuggestion = (
		selectedSuggestion: TSuggestion,
		view: EditorView,
	) => {
		onSuggestionSelected({
			selectedSuggestion,
			query: pluginState.query,
			view,
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
						selectSuggestion(selectedSuggestion, view);
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
						selectSuggestion: (selectedSuggestion) =>
							selectSuggestion(selectedSuggestion, view),
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
	TSuggestion extends SuggestionItem,
	ToolbarWrapperElement extends HTMLElement,
	SuggestionItemElement extends HTMLElement,
>({
	toolbarWrapper,
	suggestionItem,
}: SuggestionOptions<
	TSuggestion,
	ToolbarWrapperElement,
	SuggestionItemElement
>) {
	const wrapperElement = toolbarWrapper.mount();
	document.body.appendChild(wrapperElement);

	let stopFloatingUpdate: (() => void) | null = null;

	return {
		element: wrapperElement,
		updateSelectedStyles(selectedIndex: number) {
			(Array.from(wrapperElement.children) as SuggestionItemElement[]).forEach(
				(child, index) => {
					suggestionItem.updateSelected(child, index === selectedIndex);
				},
			);
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
			stopFloatingUpdate = autoUpdate(anchor, wrapperElement, () => {
				computePosition(anchor, wrapperElement, {
					placement: "top-start",
					middleware: [
						inline(),
						offset(8),
						flip({ padding: 8 }),
						shift({ padding: 8, limiter: limitShift() }),
					],
				}).then(({ x, y, strategy }) => {
					Object.assign(wrapperElement.style, {
						position: strategy,
						left: `${x}px`,
						top: `${y}px`,
					});
				});
			});
			toolbarWrapper.show(wrapperElement);
			this.element.innerHTML = "";

			for (const suggestion of suggestions) {
				const item = suggestionItem.mount(suggestion);
				item.addEventListener("click", () => {
					selectSuggestion(suggestion);
				});
				this.element.appendChild(item);
			}

			this.updateSelectedStyles(0);
		},
		closeSuggestions() {
			stopFloatingUpdate?.();
			toolbarWrapper.hide(wrapperElement);
		},
		destroy() {
			stopFloatingUpdate?.();
			wrapperElement.remove();
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
