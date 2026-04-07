// --------------------------------------------------------
/**
 * * returns "slugified" text.
 * @param text: string - text to slugify
 */
export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase() // convert to lowercase
		.replace(/\s+/g, "-") // replace spaces with -
		.replace(/[^\w-]+/g, "") // remove all non-word chars
		.replace(/--+/g, "-") // replace multiple dashes with single dash
		.replace(/^-+/, "") // trim dash from start of text
		.replace(/-+$/, ""); // trim dash from end of text
}

/**
 * * returns "humanized" text. runs slugify() and then replaces - with space and upper case first letter of every word, and lower case the rest
 * @param text: string - text to humanize
 */
export function humanize(text: string): string {
	const slugifiedText = slugify(text);
	return (
		slugifiedText
			.replace(/-/g, " ") // replace "-" with space
			// .toLowerCase();
			.replace(
				// upper case first letter of every word, and lower case the rest
				/\w\S*/g,
				(w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
			)
	);
}

// --------------------------------------------------------
/**
 * * returns a nicely formatted string of the date passed
 * @param date: string | number | Date - date to format
 */
export function formatDate(date: string | number | Date): string {
	return new Date(date).toLocaleDateString("en-US", {
		timeZone: "UTC",
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

const WORDS_PER_MINUTE = 200;

/**
 * * returns an estimated read time for markdown or MDX content.
 * @param content: string | undefined - raw markdown/mdx body content
 */
export function getReadingTimeText(content?: string): string {
	if (!content) return "1 min read";

	const plainText = content
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`]*`/g, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/[#>*_\-\n\r]/g, " ");

	const wordCount = plainText.trim().match(/\b[\w'-]+\b/g)?.length ?? 0;
	const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

	return `${minutes} min read`;
}
