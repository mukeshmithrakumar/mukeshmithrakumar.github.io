import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";
import siteData from "@config/siteData.json";

// utils
import { getAllPosts, getPostUrl } from "@js/blogUtils";

// this is needed for getAuthorName() and getAuthorEmail() below
const authors: CollectionEntry<"authors">[] = await getCollection("authors");

export async function GET(context) {
	const posts = await getAllPosts();

	// TODO: (maybe?) handle multiple authors instead of just putting the first author's data
	return rss({
		// ex. you can use a stylesheet from "public/rss/styles.xsl"
		// stylesheet: "/rss/styles.xsl",
		// `<title>` field in output xml
		title: siteData.title,
		// `<description>` field in output xml
		description: siteData.description,
		// Pull in your project "site" from the endpoint context
		// https://docs.astro.build/en/reference/api-reference/#contextsite
		site: context.site,
		// media is needed for blog posts. recommended to add atom support
		xmlns: {
			media: "http://search.yahoo.com/mrss/",
			atom: "http://www.w3.org/2005/Atom",
		},
		// add atom:link to be compatible with atom
		customData: `<atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />`,
		// items (each post)
		items: posts.map((post) => ({
			title: post.data.title,
			description: getRssDescription(post),
			pubDate: post.data.pubDate,
			author: `${getAuthorEmail(post.data.authors[0].id)} (${getAuthorName(
				post.data.authors[0].id,
			)})`,

			// custom data example, define in XML tags
			// this adds the blog post image
			customData: `<media:content
          type="image/${post.data.heroImage.format == "jpg" ? "jpeg" : "png"}"
          width="${post.data.heroImage.width}"
          height="${post.data.heroImage.height}"
          medium="image"
          url="${getImageUrl(post)}" />
      `,

			// Compute RSS link from post `slug`
			// This example assumes all posts are rendered as `/blog/[slug]` routes
			link: getPostUrl(post),
		})),
	});
}

// --------------------------------------------------------
// map the post author slug to the author name
const getAuthorName = (authorSlug: string) => {
	let authorName = "unk";
	authors.map((author) => {
		if (author.id === authorSlug) {
			authorName = author.data.name;
		}
	});

	return authorName;
};

// --------------------------------------------------------
// map the post author slug to the author email
const getAuthorEmail = (authorSlug: string) => {
	let authorEmail = "";
	authors.map((author) => {
		if (author.id === authorSlug) {
			authorEmail = author.data.email;
		}
	});

	return authorEmail;
};

// --------------------------------------------------------
// get image url from frontmatter
const getImageUrl = (post: CollectionEntry<"blog">) => {
	let imageUrl = "";
	let imageUrlEnd = "";

	// assumes post.data.heroImage is defined
	imageUrlEnd = post.data.heroImage.src.toString();

	// in dev mode, url is /@fs/full/path/to/project/public/assets/images/image-name.jpg
	if (imageUrlEnd.startsWith("/@fs")) {
		imageUrl = imageUrlEnd;
	}
	// in deployment, imageUrlEnd is correct. Something like "_astro/img-name.hash.jpg"
	else {
		imageUrl = import.meta.env.SITE + imageUrlEnd;
	}

	return imageUrl;
};

// --------------------------------------------------------
// prefer explicit frontmatter description, otherwise derive a short summary from the post body
const getRssDescription = (post: CollectionEntry<"blog">) => {
	const explicitDescription = post.data.description?.trim();

	if (explicitDescription) {
		return explicitDescription;
	}

	const excerpt = extractExcerptFromBody(post.body);

	if (excerpt) {
		return excerpt;
	}

	return post.data.title;
};

// --------------------------------------------------------
function extractExcerptFromBody(body: string): string {
	const normalizedBody = body.replace(/\r\n/g, "\n");
	const blocks = normalizedBody
		.split(/\n\s*\n/)
		.map((block) => block.trim())
		.filter(Boolean);

	for (const block of blocks) {
		if (isSkippableExcerptBlock(block)) continue;

		const plainText = markdownToPlainText(block);

		if (!plainText) continue;

		return truncateExcerpt(plainText, 220);
	}

	return "";
}

function isSkippableExcerptBlock(block: string): boolean {
	return (
		block.startsWith("import ") ||
		block.startsWith("export ") ||
		block.startsWith("```") ||
		block.startsWith("---") ||
		block.startsWith("#") ||
		block.startsWith("<") ||
		block.startsWith("![")
	);
}

function markdownToPlainText(markdown: string): string {
	return markdown
		.replace(/!\[[^\]]*]\([^)]*\)/g, "")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/__([^_]+)__/g, "$1")
		.replace(/\*([^*]+)\*/g, "$1")
		.replace(/_([^_]+)_/g, "$1")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function truncateExcerpt(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;

	const truncated = text.slice(0, maxLength);
	const lastSpace = truncated.lastIndexOf(" ");

	if (lastSpace <= 0) return `${truncated}...`;

	return `${truncated.slice(0, lastSpace)}...`;
}
