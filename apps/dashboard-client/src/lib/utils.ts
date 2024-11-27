import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function getFileStemAndExtension(fileName: string) {
	const lastDotIndex = fileName.lastIndexOf(".");
	const fileStem =
		lastDotIndex === -1 ? fileName : fileName.slice(0, lastDotIndex);
	const fileExtension = lastDotIndex === -1 ? "" : fileName.slice(lastDotIndex);
	return { fileStem, fileExtension };
}
