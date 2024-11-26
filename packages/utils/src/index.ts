import { z } from "zod";

export const isString = (value: unknown): value is string =>
	z.string().safeParse(value).success;

export const isStringArray = (value: unknown): value is string[] =>
	z.array(z.string()).safeParse(value).success;
