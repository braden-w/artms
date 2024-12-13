import { TiptapEditor } from "@/components/tip-tap/TiptapEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { trpc } from "@/router";
import { evaluateFilter } from "@repo/dashboard-server/conditions";
import type { SelectPage } from "@repo/dashboard-server/db/schema/pages";
import { useQuery } from "@tanstack/react-query";
import { EditIcon, X } from "lucide-react";
import {
	RenderValueAsCell,
	type SaveStatus,
	useDebouncedReplacePage,
} from "./RenderValue";
// import { CommandPalette } from "./CommandPalette";
// import { promptButtons } from "./prompts";

export function PageEditorDialog({ id }: { id: string }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<EditIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="flex h-full max-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col overflow-y-auto">
				<PageEditor id={id} />
			</DialogContent>
		</Dialog>
	);
}

export function PageEditor({ id }: { id: string }) {
	const { debouncedReplacePage, saveStatus } = useDebouncedReplacePage();
	const [page] = trpc.pages.getPageById.useSuspenseQuery({ id });
	const [columns] = trpc.columns.getAllColumns.useSuspenseQuery(undefined);

	const processText = (text: string) => {
		let title = "";
		let subtitle = "";
		let content = "";
		let isProcessingContent = false;

		const lines = text.split("\n");

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]!;

			if (!isProcessingContent) {
				if (i === 0) {
					// Process title
					title = line.replace(/^#? ?/, "").trim();
				} else if (line.startsWith("## ")) {
					// Process subtitle, regardless of its position
					subtitle = line.replace(/^## ?/, "").trim();
					isProcessingContent = true; // Start content processing after subtitle
				} else if (line.trim() !== "") {
					// Start of content if we encounter a non-empty line that's not a subtitle
					isProcessingContent = true;
					content += line;
				}
				// Skip empty lines between title and subtitle/content
			} else {
				// Append to content, preserving original formatting
				content += (content ? "\n" : "") + line;
			}
		}

		// Trim any leading/trailing whitespace from content
		content = content.trim();

		return { title, subtitle, content };
	};

	const titleSubtitleContent = `# ${page.title ?? ""}\n\n## ${page.subtitle ?? ""}\n\n${page.content ?? ""}`;
	const titleSubtitle = `# ${page.title ?? ""}\n\n## ${page.subtitle ?? ""}`;

	return (
		<div className="flex max-h-[calc(100vh-8rem)] flex-col gap-2">
			<dl className="-my-3 divide-y divide-muted text-sm">
				{columns
					.filter(({ filter }) => {
						const isColumnShouldBeVisible =
							!filter || evaluateFilter(page, filter);
						return isColumnShouldBeVisible;
					})
					.map((column) => (
						<div
							className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4"
							key={column.name}
						>
							<dt className="p-2 font-medium text-foreground">{column.name}</dt>
							<dd className="text-foreground sm:col-span-2">
								<RenderValueAsCell
									value={page[column.name]}
									column={column}
									page={page}
								/>
							</dd>
						</div>
					))}
			</dl>
			<div className="flex flex-wrap items-center gap-2 rounded-md bg-muted p-1">
				{/* {promptButtons.map(({ label, component: Component }, index) => (
					<Component key={label} page={page} setPage={setPageSaveDbDebounce} />
				))} */}
				{/* <SuggestOnTypeResonance page={page} setPage={setPageSaveDbDebounce} />
					<SuggestTitleSubtitle page={page} setPage={setPageSaveDbImmediate} /> */}
				{/* <SuggestFromVoiceTranscript
						page={page}
						setPage={setPageSaveDbImmediate}
					/> */}
			</div>
			{/* <div className="p-1 bg-muted flex gap-2 items-center rounded-md">
				<Button
					onClick={() =>
						createRelease({
							id: nanoid(),
							page_id: page.id,
							full_text: titleSubtitleContent,
							created_at: dayjs().toISOString(),
						})
					}
				>
					<PlusIcon />
					Add Release
				</Button>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline">Open</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Releases</SheetTitle>
							<SheetDescription>Add a release to this page.</SheetDescription>
						</SheetHeader>
						<div className="grid gap-4 py-4">
							{releases?.map((release) => (
								<div key={release.id} className="border p-4 mb-4 rounded-md">
									<h3 className="text-lg font-semibold mb-2">
										Release {release.id}
									</h3>
									<p className="mb-2">
										<strong>Page ID:</strong> {release.page_id}
									</p>
									<p className="mb-2">
										<strong>Text:</strong> {release.text}
									</p>
									<p className="mb-2">
										<strong>Recording Status:</strong>{" "}
										{release.recording_status}
									</p>
									<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
										ffmpeg -f avfoundation -i ":0" -sample_rate 48000 -rtbufsize
										2048 -af "aresample=async=1000" -c:a aac -b:a 256k -ar 48000
										-y {release.folderPath}recording.m4a
									</code>
								</div>
							))}
							{releases?.length === 0 && (
								<p>No releases available for this page.</p>
							)}
						</div>
						<SheetFooter>
							<SheetClose asChild>
								<Button type="submit">Save changes</Button>
							</SheetClose>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</div> */}
			<Tabs defaultValue="single">
				<div className="flex items-center justify-between">
					<TabsList>
						<TabsTrigger value="single">Main Editor</TabsTrigger>
						<TabsTrigger value="split">Split Editor</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="single">
					<TiptapEditor
						key={page.id}
						value={titleSubtitleContent}
						setValue={(text) => {
							const { title, subtitle, content } = processText(text);
							debouncedReplacePage({ ...page, title, subtitle, content });
						}}
						saveStatus={saveStatus}
						page={page}
					/>
				</TabsContent>
				<TabsContent value="split">
					<TiptapEditor
						key={`${page.id}-title-subtitle`}
						value={titleSubtitle}
						setValue={(text) => {
							const { title, subtitle } = processText(text);
							debouncedReplacePage({ ...page, title, subtitle });
						}}
						saveStatus={saveStatus}
						page={page}
					/>
					<SplitEditor
						key={`${page.id}-split`}
						draftText={page.content_draft ?? ""}
						setDraftText={(text) =>
							debouncedReplacePage({ ...page, content_draft: text })
						}
						reviewText={page.content_review ?? ""}
						setReviewText={(text) =>
							debouncedReplacePage({ ...page, content_review: text })
						}
						contentText={page.content ?? ""}
						setContentText={(text) =>
							debouncedReplacePage({ ...page, content: text })
						}
						saveStatus={saveStatus}
						page={page}
					/>
				</TabsContent>
			</Tabs>
			{/* TODO: Restore Inbound and Outbound Links */}
			{/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<InboundLinks page={page} setPage={setPageSaveDbDebounce} />
					<OutboundLinks page={page} />
				</div> */}
			{/* <Button as-child>
				<a :href="`/notes/${page.id}/suggest`">Suggest Connections</a>
			</Button> */}
			{/* <CommandPalette page={page} setPage={setPageSaveDbImmediate} /> */}
		</div>
	);
}

const getEarliestPage = (pages: Page[]) =>
	pages.length === 0
		? undefined
		: pages.reduce((earliestPage, currentPage) => {
				if (!earliestPage.date) return currentPage;
				if (!currentPage.date) return earliestPage;
				if (currentPage.date < earliestPage.date) return currentPage;
				return earliestPage;
			});

function InboundLinks({
	page,
	setPage,
}: {
	page: Page;
	setPage: (newPage: Page) => void;
}) {
	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["pages-referencing-page", page.id],
		queryFn: async () => {
			const pagesReferencingPage =
				await actions.pages.getPagesReferencingPage.orThrow(page);
			const earliestPage = getEarliestPage(pagesReferencingPage);
			if (earliestPage?.date && page.date && earliestPage.date < page.date) {
				if (
					window.confirm(
						`Update page date to earliest page date?\nCurrent page date: ${page.date}\nEarliest page date: ${earliestPage.date}`,
					)
				) {
					setPage({ ...page, date: earliestPage.date });
				}
			}
			return pagesReferencingPage;
		},
	});
	return (
		<div>
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error: {JSON.stringify(error)}</p>}
			{data && (
				<Card>
					<CardHeader className="flex flex-row items-center">
						<div className="grid gap-2">
							<CardTitle>Inbound links</CardTitle>
							<CardDescription>Citing pages/Backlinks</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						{data.map((page) => (
							<Button asChild key={page.id} variant="secondary">
								<a href={`/pages/${page.id}`}>{page.title}</a>
							</Button>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

function OutboundLinks({ page }: { page: Page }) {
	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ["pages-referenced-by-page", page.id],
		queryFn: async () => {
			const pagesReferencedByPage =
				await actions.pages.getPagesReferencedByPage.orThrow(page);
			return pagesReferencedByPage;
		},
	});
	return (
		<div>
			{isLoading && <p>Loading...</p>}
			{isError && <p>Error: {JSON.stringify(error)}</p>}
			{data && (
				<Card>
					<CardHeader className="flex flex-row items-center">
						<div className="grid gap-2">
							<CardTitle>Outgoing links</CardTitle>
							<CardDescription>Cited pages/Forward links</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						{data.map((page) => (
							<Button asChild key={page.id} variant="secondary">
								<a href={`/pages/${page.id}`}>{page.title}</a>
							</Button>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

// Three columns
// Draft | Review | Content;
// Initial | Intermediate | Content;
// Unstaged | Staged | Content;
function SplitEditor({
	draftText,
	setDraftText,
	reviewText,
	setReviewText,
	contentText,
	setContentText,
	saveStatus,
	page,
}: {
	draftText: string;
	setDraftText: (newText: string) => void;
	reviewText: string;
	setReviewText: (newText: string) => void;
	contentText: string;
	setContentText: (newText: string) => void;
	saveStatus: SaveStatus;
	page: Page;
}) {
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel>
				<TiptapEditor
					value={draftText}
					setValue={setDraftText}
					saveStatus={saveStatus}
					page={page}
				/>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel>
				<TiptapEditor
					value={reviewText}
					setValue={setReviewText}
					saveStatus={saveStatus}
					page={page}
				/>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel>
				<TiptapEditor
					value={contentText}
					setValue={setContentText}
					saveStatus={saveStatus}
					page={page}
				/>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

function SuggestionBadges({
	className,
	suggestions,
	setSuggestions,
	onSelect,
}: {
	className?: string;
	suggestions: string[];
	setSuggestions: Dispatch<SetStateAction<string[]>>;
	onSelect?: (selected: string) => void;
}) {
	return (
		<div
			className={cn(
				"group rounded-md border border-input px-3 py-1 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
				className,
			)}
		>
			<div className="flex flex-wrap gap-1">
				{suggestions.map((selected) => {
					const removeSuggestion = () =>
						setSuggestions((prev) => prev.filter((s) => s !== selected));

					return (
						<Badge key={selected} variant="secondary">
							{selected}
							<Button
								className="h-4 w-4"
								size="icon"
								variant="ghost"
								onKeyDown={(e) => {
									if (e.key === "Enter") removeSuggestion();
								}}
								onClick={removeSuggestion}
							>
								<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
							</Button>
						</Badge>
					);
				})}
			</div>
		</div>
	);
}
