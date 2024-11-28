import { customAlphabet } from "nanoid";
import type { SelectPage } from "#db/schema/pages";
import {
	type ColumnInDatabase,
	COLUMNS_IN_DATABASE,
} from "#db/COLUMNS_IN_DATABASE";

const NANO_ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";
const NANO_ID_LENGTH = 21;

export const nanoid = customAlphabet(NANO_ID_CHARS, NANO_ID_LENGTH);
export const PAGE_ID_PATTERN = `[${NANO_ID_CHARS}]{${NANO_ID_LENGTH}}` as const;
const STANDARD_LINK_PATTERN =
	`\\[[^\\]]*\\]\\((${PAGE_ID_PATTERN})\\)` as const;
const AUTOMATIC_LINK_PATTERN = `<(${PAGE_ID_PATTERN})>` as const;
export const PAGE_LINK_PATTERN =
	`(?:${STANDARD_LINK_PATTERN}|${AUTOMATIC_LINK_PATTERN})` as const;

const generatePageInitialProperties = () =>
	({
		id: nanoid(),
		status: "Needs Scaffolding",
		date: new Date().toISOString(),
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	}) satisfies Partial<SelectPage>;

export const generateDefaultPage = (
	initialValues?: Partial<SelectPage>,
): SelectPage => ({
	...(Object.fromEntries(
		COLUMNS_IN_DATABASE.map((column) => [column.name, null]),
	) as Record<ColumnInDatabase["name"], null>),
	...generatePageInitialProperties(),
	...initialValues,
});
