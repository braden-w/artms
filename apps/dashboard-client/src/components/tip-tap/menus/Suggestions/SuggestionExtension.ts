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

type SuggestionOptions<TSuggestion extends SuggestionItem> = {
	/**
	 * The string that triggers the suggestion popup (e.g. "@" for mentions or "[[" for page links)
	 * @default "[["
	 */
	suggestionTriggerPrefix: string;

	/**
	 * Async function to fetch suggestions based on user input after the suggestion trigger prefix
	 */
	getSuggestionsFromQuery: (query: string) => Promise<TSuggestion[]>;

	/**
	 * Callback fired when a suggestion is selected
	 * @default
	 */
	onSuggestionSelected: ({
		selectedSuggestion,
		query,
		view,
	}: {
		selectedSuggestion: TSuggestion;
		query: string;
		view: EditorView;
	}) => void;

	/**
	 * Creates the container element for the suggestion toolbar
	 * @default Returns a <ul> with Tailwind classes for styling
	 */
	createToolbarElement: () => HTMLElement;

	/**
	 * Creates an element for an individual suggestion item
	 * @default Returns a <li> with the suggestion title and hover styles
	 */
	createSuggestionElement: (suggestion: TSuggestion) => HTMLElement;

	/**
	 * Implementation of the visibility of the suggestion toolbar
	 * @default Toggles 'hidden' class on the element
	 */
	updateToolbarVisibility: (element: HTMLElement, isVisible: boolean) => void;

	/**
	 * Implementation of the visual selection state of a suggestion item
	 * @default Toggles 'bg-accent' and 'text-accent-foreground' classes on the element
	 */
	updateSuggestionSelection: (
		element: HTMLElement,
		isSelected: boolean,
	) => void;
};

const DEFAULT_SUGGESTION_TRIGGER_PREFIX = "[[";

export const SuggestionExtension = Extension.create<
	SuggestionOptions<SuggestedPage>
>({
	name: PLUGIN_NAME,
	addOptions() {
		return {
			suggestionTriggerPrefix: DEFAULT_SUGGESTION_TRIGGER_PREFIX,
			getSuggestionsFromQuery: async () => [],
			onSuggestionSelected: async () => {},
			createToolbarElement: () => {
				const toolbarElement = document.createElement("ul");
				toolbarElement.className =
					"flex flex-col space-y-1 rounded-md border bg-background p-1";
				return toolbarElement;
			},
			createSuggestionElement: (suggestion) => {
				const suggestionElement = document.createElement("li");
				suggestionElement.innerHTML = suggestion.title;
				suggestionElement.className =
					"flex-1 line-clamp-1 text-left cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-sm";
				return suggestionElement;
			},
			updateToolbarVisibility: (element, isVisible) => {
				element.classList.toggle("hidden", !isVisible);
			},
			updateSuggestionSelection: (element, isSelected) => {
				element.classList.toggle("bg-accent", isSelected);
				element.classList.toggle("text-accent-foreground", isSelected);
			},
		};
	},
	addProseMirrorPlugins() {
		return [SuggestionPlugin(this.options)];
	},
});

function SuggestionPlugin<TSuggestion extends SuggestionItem>(
	options: SuggestionOptions<TSuggestion>,
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

function createSuggestionToolbar<TSuggestion extends SuggestionItem>({
	createToolbarElement,
	createSuggestionElement,
	updateToolbarVisibility,
	updateSuggestionSelection,
}: SuggestionOptions<TSuggestion>) {
	const wrapperElement = createToolbarElement();
	document.body.appendChild(wrapperElement);

	let stopFloatingUpdate: (() => void) | null = null;

	return {
		updateSelectedStyles(selectedIndex: number) {
			const suggestionElements = Array.from(
				wrapperElement.children,
			) as HTMLElement[];
			suggestionElements.forEach((suggestionElement, index) => {
				updateSuggestionSelection(suggestionElement, index === selectedIndex);
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
			updateToolbarVisibility(wrapperElement, true);
			wrapperElement.innerHTML = "";

			for (const suggestion of suggestions) {
				const item = createSuggestionElement(suggestion);
				item.addEventListener("click", () => {
					selectSuggestion(suggestion);
				});
				wrapperElement.appendChild(item);
			}

			this.updateSelectedStyles(0);
		},
		closeSuggestions() {
			stopFloatingUpdate?.();
			updateToolbarVisibility(wrapperElement, false);
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
