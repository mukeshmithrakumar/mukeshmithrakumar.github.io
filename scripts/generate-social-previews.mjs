import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src", "data", "blog");
const outputDir = path.join(rootDir, "public", "social-previews", "blog");

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const THUMB_WIDTH = 360;
const THUMB_HEIGHT = 470;

const blogFiles = await getBlogFiles(blogDir);

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

for (const filePath of blogFiles) {
	const frontmatter = await readFrontmatter(filePath);

	if (!frontmatter || frontmatter.draft === true) {
		continue;
	}

	const slug = sanitizeSlug(frontmatter.slug ?? getEntryId(filePath));
	const title = normalizeText(frontmatter.title);

	if (!title) {
		console.warn(`[social-previews] Skipping "${filePath}" because it has no title.`);
		continue;
	}

	const description =
		normalizeText(frontmatter.description) || "Read the full article on Mukesh Mithrakumar's blog.";
	const heroImagePath = frontmatter.heroImage
		? path.resolve(path.dirname(filePath), frontmatter.heroImage)
		: null;

	if (!heroImagePath) {
		console.warn(`[social-previews] Skipping "${filePath}" because it has no heroImage.`);
		continue;
	}

	try {
		await fs.access(heroImagePath);
	} catch {
		console.warn(
			`[social-previews] Skipping "${filePath}" because heroImage was not found: ${heroImagePath}`,
		);
		continue;
	}

	const outputPath = path.join(outputDir, `${slug}.png`);
	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	await generateSocialPreview({
		title,
		description,
		heroImagePath,
		outputPath,
	});
	console.log(`[social-previews] Generated ${path.relative(rootDir, outputPath)}`);
}

async function getBlogFiles(dirPath) {
	const entries = await fs.readdir(dirPath, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = path.join(dirPath, entry.name);

			if (entry.isDirectory()) {
				return getBlogFiles(entryPath);
			}

			if (!entry.isFile()) {
				return [];
			}

			if (!/\.(md|mdx)$/i.test(entry.name) || entry.name.startsWith("_")) {
				return [];
			}

			return [entryPath];
		}),
	);

	return files.flat();
}

async function readFrontmatter(filePath) {
	const fileContents = await fs.readFile(filePath, "utf8");
	const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---/);

	if (!match) {
		return null;
	}

	return YAML.parse(match[1]);
}

function getEntryId(filePath) {
	const relativePath = path.relative(blogDir, filePath);
	return relativePath
		.replace(/\.(md|mdx)$/i, "")
		.split(path.sep)
		.join("/");
}

function sanitizeSlug(slug) {
	return String(slug)
		.trim()
		.replace(/^\/+|\/+$/g, "");
}

function normalizeText(value) {
	return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

async function generateSocialPreview({ title, description, heroImagePath, outputPath }) {
	const background = await sharp(heroImagePath)
		.resize(CARD_WIDTH, CARD_HEIGHT, { fit: "cover", position: "centre" })
		.modulate({ brightness: 0.62, saturation: 1.08 })
		.blur(10)
		.png()
		.toBuffer();

	const thumbnail = await createRoundedThumbnail(heroImagePath);
	const thumbnailLeft = CARD_WIDTH - THUMB_WIDTH - 72;
	const thumbnailTop = 80;

	const overlaySvg = createOverlaySvg({
		title,
		description,
		thumbnailLeft,
		thumbnailTop,
	});

	await sharp(background)
		.composite([
			{
				input: thumbnail,
				left: thumbnailLeft,
				top: thumbnailTop,
			},
			{
				input: Buffer.from(overlaySvg),
				top: 0,
				left: 0,
			},
		])
		.png()
		.toFile(outputPath);
}

async function createRoundedThumbnail(heroImagePath) {
	const roundedMask = Buffer.from(`
		<svg width="${THUMB_WIDTH}" height="${THUMB_HEIGHT}" viewBox="0 0 ${THUMB_WIDTH} ${THUMB_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
			<rect width="${THUMB_WIDTH}" height="${THUMB_HEIGHT}" rx="30" ry="30" fill="#fff" />
		</svg>
	`);

	return sharp(heroImagePath)
		.resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: "cover", position: "centre" })
		.composite([{ input: roundedMask, blend: "dest-in" }])
		.png()
		.toBuffer();
}

function createOverlaySvg({ title, description, thumbnailLeft, thumbnailTop }) {
	const titleLines = wrapText(title, 28, 3);
	const descriptionLines = wrapText(description, 54, 3);

	const titleSvg = renderTextLines({
		lines: titleLines,
		x: 72,
		y: 214,
		lineHeight: 68,
		fontSize: 56,
		fontWeight: 700,
		fill: "#f5f5f5",
	});

	const descriptionSvg = renderTextLines({
		lines: descriptionLines,
		x: 76,
		y: 442,
		lineHeight: 38,
		fontSize: 28,
		fontWeight: 400,
		fill: "#d4d4d8",
	});

	return `
		<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="bgShade" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stop-color="#050816" stop-opacity="0.9" />
					<stop offset="55%" stop-color="#09090b" stop-opacity="0.76" />
					<stop offset="100%" stop-color="#000000" stop-opacity="0.32" />
				</linearGradient>
				<linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="#22c55e" />
					<stop offset="100%" stop-color="#14b8a6" />
				</linearGradient>
			</defs>

			<rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#bgShade)" />
			<rect x="56" y="56" width="6" height="120" rx="3" fill="url(#accent)" />
			<rect x="76" y="82" width="138" height="34" rx="17" fill="rgba(255,255,255,0.08)" />
			<text x="145" y="105" text-anchor="middle" font-size="16" font-weight="600" fill="#e5e7eb" font-family="Arial, sans-serif" letter-spacing="1.8">BLOG POST</text>
			<text x="76" y="150" font-size="22" font-weight="600" fill="#86efac" font-family="Arial, sans-serif">Mukesh Mithrakumar</text>

			<rect x="56" y="184" width="628" height="268" rx="28" fill="rgba(10,10,14,0.36)" stroke="rgba(255,255,255,0.08)" />
			${titleSvg}
			${descriptionSvg}

			<rect x="${thumbnailLeft - 8}" y="${thumbnailTop - 8}" width="${THUMB_WIDTH + 16}" height="${THUMB_HEIGHT + 16}" rx="36" fill="rgba(10,10,14,0.24)" stroke="rgba(255,255,255,0.10)" />
			<rect x="${thumbnailLeft}" y="${thumbnailTop}" width="${THUMB_WIDTH}" height="${THUMB_HEIGHT}" rx="30" fill="transparent" />

			<rect x="76" y="540" width="1048" height="1" fill="rgba(255,255,255,0.14)" />
			<text x="76" y="578" font-size="20" font-weight="500" fill="#a1a1aa" font-family="Arial, sans-serif">mukeshmithrakumar.com</text>
		</svg>
	`;
}

function renderTextLines({ lines, x, y, lineHeight, fontSize, fontWeight, fill }) {
	return `
		<text x="${x}" y="${y}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" font-family="Arial, sans-serif">
			${lines
				.map(
					(line, index) =>
						`<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
				)
				.join("")}
		</text>
	`;
}

function wrapText(text, maxCharsPerLine, maxLines) {
	const words = text.split(/\s+/).filter(Boolean);
	const lines = [];
	let currentLine = "";
	let isTruncated = false;

	for (const word of words) {
		const nextLine = currentLine ? `${currentLine} ${word}` : word;

		if (nextLine.length <= maxCharsPerLine) {
			currentLine = nextLine;
			continue;
		}

		if (currentLine) {
			lines.push(currentLine);
		}

		currentLine = word;

		if (lines.length === maxLines - 1) {
			isTruncated = true;
			break;
		}
	}

	if (currentLine && lines.length < maxLines) {
		lines.push(currentLine);
	}

	if (lines.length === maxLines && isTruncated) {
		lines[maxLines - 1] = withEllipsis(lines[maxLines - 1], maxCharsPerLine);
	}

	return lines;
}

function withEllipsis(text, maxLength) {
	if (text.length >= maxLength - 2) {
		return `${text.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
	}

	return `${text}...`;
}

function escapeXml(value) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}
