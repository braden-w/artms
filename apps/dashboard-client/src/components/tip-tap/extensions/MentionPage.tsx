import type { SelectPage } from "@repo/dashboard-server/db/schema/pages";
import type { StringWithHtmlFragments } from "@repo/dashboard-server/utils";
import { generateDefaultPage } from "@repo/dashboard-server/utils";
import { toast } from "sonner";
import { type Entry, createSuggestionExtension } from "./createSuggestion";

interface PageEntry extends Entry {
	action: () => void;
}

export const MentionPage = (page: SelectPage) =>
	createSuggestionExtension<PageEntry>({
		name: "mentionPage",
		char: "[[",
		onSelect: ({ item }) => {
			item.action();
		},
		isValidContext: () => true,
		items: async ({ query, editor }) => {
			if (query === "") return [];
			const newPage = generateDefaultPage({
				...page,
				content: "",
				on: [],
				type: [],
				title: query,
			});
			const firstEntry = {
				type: "entry",
				id: newPage.id,
				title: newPage.title ?? "",
				description: newPage.content ?? "",
				iconName: "Book",
				action: async () => {
					const { data, error } = await actions.pages.upsertPages([newPage]);
					toast.success("Success", { description: "Row added!" });
					const pageLink = `[${newPage.title}](/pages/${newPage.id})` as const;
					editor.chain().focus().insertContent(pageLink).run();
				},
			} satisfies PageEntry;
			const { data: matchingPages, error } = await actions.pages.getPagesByFts({
				query,
			});
			if (error) return [firstEntry];
			const entries: PageEntry[] = [
				firstEntry,
				...matchingPages.map(
					(page) =>
						({
							type: "entry",
							id: page.id,
							title: page.title ?? "",
							description: page.content ?? "",
							iconName: "Book",
							action: () => {
								const cleanedTitle = stripHtml(page.title);
								const pageLink =
									`[${cleanedTitle}](/pages/${page.id})` as const;
								editor.chain().focus().insertContent(pageLink).run();
							},
						}) satisfies PageEntry,
				),
			];
			return entries;
		},
	});

function stripHtml(strInputCode: StringWithHtmlFragments) {
	const div = document.createElement("div");
	div.innerHTML = strInputCode;
	return div.textContent ?? div.innerText;
}
