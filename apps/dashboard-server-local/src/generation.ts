import { type ReadStream, createReadStream } from "node:fs";
import { readFile, writeFile, exists } from "node:fs/promises";
import * as path from "node:path";
import OpenAI from "openai";
import type { TranscriptionWord } from "openai/resources/audio/transcriptions";

const VIDEO_ID = "thst-430-1";

processVideoRelease(VIDEO_ID);

async function processVideoRelease(videoId: string) {
	const {
		inputs: {
			script,
			narrationFileStream,
			narrationPath,
			backgroundVideoFilePath,
		},
		outputs: { outputVideoPath: videoPath, srtPath },
	} = await createFolderPaths(videoId);

	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OPENAI_API_KEY environment variable is required");
	}

	const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

	const transcript = await getVerboseTranscript({
		narrationFileStream,
		script,
		openAiClient,
	});

	if (!transcript.words) {
		throw new Error("No words found in transcript");
	}

	for (const word of transcript.words) {
		console.log(`Word: ${word.word}, Start: ${word.start}, End: ${word.end}`);
	}

	const srtFilePath = await createSrtFile({
		words: transcript.words,
		outputPath: srtPath,
	});

	const outputVideoPath = await burnSubtitlesAndOverlayAudio({
		backgroundVideoFilePath,
		audioFilePath: narrationPath,
		srtFilePath,
		outputVideoPath: videoPath,
	});

	return outputVideoPath;
}

async function createFolderPaths(videoId: string) {
	const folderPath = path.resolve(videoId);
	const markdownScriptPath = path.join(folderPath, "script.md");
	const narrationPath = path.join(folderPath, "recording.m4a");
	const backgroundVideoFilePath = path.join(folderPath, "background_video.mov");

	const [isMarkdownScriptExists, isNarrationExists, isBackgroundVideoExists] =
		await Promise.all([
			exists(markdownScriptPath),
			exists(narrationPath),
			exists(backgroundVideoFilePath),
		]);
	const isInputFilesAllExist =
		isMarkdownScriptExists && isNarrationExists && isBackgroundVideoExists;

	if (!isInputFilesAllExist) {
		throw new Error("Input files are missing");
	}

	const script = await readFile(markdownScriptPath, "utf-8");
	const narrationFileStream = createReadStream(narrationPath);

	return {
		inputs: {
			script,
			narrationFileStream,
			narrationPath,
			backgroundVideoFilePath,
		},
		outputs: {
			outputVideoPath: path.join(folderPath, "output.mp4"),
			srtPath: path.join(folderPath, "transcript.srt"),
		},
	};
}

async function getVerboseTranscript({
	narrationFileStream,
	script,
	openAiClient,
}: { narrationFileStream: ReadStream; script: string; openAiClient: OpenAI }) {
	const response = await openAiClient.audio.transcriptions.create({
		model: "whisper-1",
		file: narrationFileStream,
		prompt: script,
		response_format: "verbose_json",
		timestamp_granularities: ["word"],
		language: "en",
		temperature: 0,
	});
	return response;
}

function formatSrtTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	const milliseconds = Math.floor((seconds - Math.floor(seconds)) * 1000);

	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
}

async function createSrtFile({
	words,
	outputPath,
	wordsPerLine = 4,
}: {
	words: TranscriptionWord[];
	outputPath: string;
	wordsPerLine?: number;
}): Promise<string> {
	let srtContent = "";
	let subtitleIndex = 1;

	for (let i = 0; i < words.length; i += wordsPerLine) {
		const chunk = words.slice(i, i + wordsPerLine);
		const startTime = formatSrtTime(chunk[0].start);
		const endTime = formatSrtTime(chunk[chunk.length - 1].end);
		const text = chunk.map((word) => word.word).join(" ");

		srtContent += `${subtitleIndex}\n${startTime} --> ${endTime}\n${text}\n\n`;
		subtitleIndex++;
	}

	await writeFile(outputPath, srtContent, "utf-8");
	console.log(`SRT subtitle file saved as ${outputPath}`);
	return outputPath;
}

async function burnSubtitlesAndOverlayAudio({
	backgroundVideoFilePath,
	audioFilePath,
	srtFilePath,
	outputVideoPath,
}: {
	backgroundVideoFilePath: string;
	audioFilePath: string;
	srtFilePath: string;
	outputVideoPath: string;
}) {
	const proc =
		await Bun.$`ffmpeg -i ${backgroundVideoFilePath} -i ${audioFilePath} \
      -filter_complex "[0:v]subtitles=${srtFilePath}:force_style='FontName=Lato-Black,FontSize=12,PrimaryColour=&H000000,OutlineColour=&HFFFFFF,Outline=3,BorderStyle=3,Alignment=2,MarginV=42'[v];[0:a]volume=0.1[bg_audio];[1:a][bg_audio]amix=inputs=2:duration=shortest[a]" \
      -map "[v]" -map "[a]" \
      -c:v libx264 -preset slow -crf 23 -profile:v high \
      -pix_fmt yuv420p -movflags +faststart \
      -c:a aac -b:a 192k \
      -r 30 -g 60 -bf 2 \
      -shortest -y ${outputVideoPath}`;

	console.log(`Video with subtitles saved as ${outputVideoPath}`);
	console.log(proc.stdout);
	return outputVideoPath;
}
