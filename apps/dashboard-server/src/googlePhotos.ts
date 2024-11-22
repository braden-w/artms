import { z } from "zod";

const timestampStringSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);

// MediaMetadata sub-schemas
const photoMetadataSchema = z.object({
	cameraMake: z.string().nullish().default(null),
	cameraModel: z.string().nullish().default(null),
	focalLength: z.number().nullish().default(null),
	apertureFNumber: z.number().nullish().default(null),
	isoEquivalent: z.number().nullish().default(null),
	exposureTime: z
		.string()
		.regex(/^\d+(\.\d+)?s$/)
		.nullish()
		.default(null),
});

const VideoProcessingStatus = z.union([
	z.literal("UNSPECIFIED"),
	z.literal("PROCESSING"),
	z.literal("READY"),
	z.literal("FAILED"),
]);

const videoMetadataSchema = z.object({
	cameraMake: z.string().nullish().default(null),
	cameraModel: z.string().nullish().default(null),
	fps: z.number().nullish().default(null),
	status: VideoProcessingStatus,
});

const mediaMetadataSchema = z.object({
	creationTime: timestampStringSchema,
	width: z.coerce.number().nullish().default(null),
	height: z.coerce.number().nullish().default(null),
	photo: photoMetadataSchema.nullish().default(null),
	video: videoMetadataSchema.nullish().default(null),
});

export type MediaMetadata = z.infer<typeof mediaMetadataSchema>;

// ContributorInfo schema
const contributorInfoSchema = z.object({
	profilePictureBaseUrl: z.string().url(),
	displayName: z.string(),
});

export type ContributorInfo = z.infer<typeof contributorInfoSchema>;

// Main MediaItem schema
export const mediaItemSchema = z.object({
	id: z.string(),
	description: z.string().max(1000).nullish().default(null),
	productUrl: z.string().url(),
	baseUrl: z.string().url(),
	mimeType: z.string(),
	mediaMetadata: mediaMetadataSchema,
	contributorInfo: contributorInfoSchema.nullish().default(null),
	filename: z.string(),
});
