import { z } from "zod";

export const isString = (value: unknown): value is string =>
	z.string().safeParse(value).success;

export const isStringArray = (input: unknown): input is string[] =>
	z.string().array().safeParse(input).success;

export const isNumber = (input: unknown): input is number =>
	z.number().safeParse(input).success;

export const isBoolean = (input: unknown): input is boolean =>
	z.boolean().safeParse(input).success;
