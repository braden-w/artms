import { customAlphabet } from "nanoid";
import { z } from "zod";

const NANO_ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";
const NANO_ID_LENGTH = 21;

export const nanoid = customAlphabet(NANO_ID_CHARS, NANO_ID_LENGTH);
export const PAGE_ID_PATTERN = `[${NANO_ID_CHARS}]{${NANO_ID_LENGTH}}` as const;
const STANDARD_LINK_PATTERN =
	`\\[[^\\]]*\\]\\((${PAGE_ID_PATTERN})\\)` as const;
const AUTOMATIC_LINK_PATTERN = `<(${PAGE_ID_PATTERN})>` as const;
export const PAGE_LINK_PATTERN =
	`(?:${STANDARD_LINK_PATTERN}|${AUTOMATIC_LINK_PATTERN})` as const;
