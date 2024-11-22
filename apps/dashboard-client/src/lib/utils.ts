import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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
