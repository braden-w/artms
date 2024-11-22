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

export const isString = (input: unknown): input is string =>
	z.string().safeParse(input).success;

export const isStringArray = (input: unknown): input is readonly string[] =>
	z.string().array().safeParse(input).success;

export const isNumber = (input: unknown): input is number =>
	z.number().safeParse(input).success;

export const isBoolean = (input: unknown): input is boolean =>
	z.boolean().safeParse(input).success;

export function getFileStemAndExtension(fileName: string) {
	const lastDotIndex = fileName.lastIndexOf(".");
	const fileStem =
		lastDotIndex === -1 ? fileName : fileName.slice(0, lastDotIndex);
	const fileExtension = lastDotIndex === -1 ? "" : fileName.slice(lastDotIndex);
	return { fileStem, fileExtension };
}
