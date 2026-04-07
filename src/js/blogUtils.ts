import { type CollectionEntry, getCollection, getEntry } from "astro:content";

// utils
import { slugify } from "@js/textUtils";

// --------------------------------------------------------
/**
 * * returns all blog posts, filtered for drafts, sorted by date, and future posts removed
 * use like `const posts = await getAllPosts();`
 */
export async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
	const posts = await getCollection("blog", ({ data }) => {
		// filter out draft posts
		return data.draft !== true;
	});

	// filter out future posts and sort by date
	const formattedPosts: CollectionEntry<"blog">[] = formatPosts(posts, {
		filterOutFuturePosts: true,
		sortByDate: true,
		limit: undefined,
	});

	validateUniquePostSlugs(formattedPosts);

	return formattedPosts;
}

// --------------------------------------------------------
/**
 * * returns the canonical public slug for a blog post
 * note: if frontmatter `slug` is omitted, falls back to Astro's content entry id
 */
export function getPostSlug(post: CollectionEntry<"blog">): string {
	return sanitizePostSlug(post.data.slug ?? post.id);
}

// --------------------------------------------------------
/**
 * * returns the canonical public URL for a blog post
 */
export function getPostUrl(post: CollectionEntry<"blog">): string {
	return `/blog/${getPostSlug(post)}/`;
}

// --------------------------------------------------------
/**
 * * returns all blog posts in a formatted array
 * @param posts: CollectionEntry<"blog">[] - array of posts, unformatted
 * note: this has an optional options object, params below
 * @param filterOutFuturePosts: boolean - if true, filters out future posts
 * @param sortByDate: boolean - if true, sorts posts by date
 * @param limit: number - if number is passed, limits the number of posts returned
 */
interface FormatPostsOptions {
	filterOutFuturePosts?: boolean;
	sortByDate?: boolean;
	limit?: number;
}

export function formatPosts(
	posts: CollectionEntry<"blog">[],
	{ filterOutFuturePosts = true, sortByDate = true, limit = undefined }: FormatPostsOptions = {},
): CollectionEntry<"blog">[] {
	const filteredPosts = posts.reduce((acc: CollectionEntry<"blog">[], post) => {
		const { pubDate } = post.data;

		// filterOutFuturePosts if true
		if (filterOutFuturePosts && new Date(pubDate) > new Date()) return acc;

		// add post to acc
		acc.push(post);

		return acc;
	}, []);

	// now we have filteredPosts
	// sortByDate or randomize
	if (sortByDate) {
		filteredPosts.sort(
			(a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
				new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
		);
	} else {
		filteredPosts.sort(() => Math.random() - 0.5);
	}

	// limit if number is passed
	if (typeof limit === "number") {
		return filteredPosts.slice(0, limit);
	}
	return filteredPosts;
}

// --------------------------------------------------------
/**
 * * returns true if the posts are related to each other
 * @param postOne: CollectionEntry<"blog">
 * @param postTwo: CollectionEntry<"blog">
 * note: this currently compares by tags
 */
export function arePostsRelated(
	postOne: CollectionEntry<"blog">,
	postTwo: CollectionEntry<"blog">,
): boolean {
	// if titles are the same, then they are the same post. return false
	if (getPostSlug(postOne) === getPostSlug(postTwo)) return false;

	const postOnetags = postOne.data.tags.map((category) => slugify(category));

	const postTwotags = postTwo.data.tags.map((category) => slugify(category));

	// if any tags match, return true
	const tagsMatch = postOnetags.some((category) => postTwotags.includes(category));

	return tagsMatch;
}

// --------------------------------------------------------
/**
 * * returns related blog posts ranked by shared tags and recency
 */
export function getRelatedPosts(
	currentPost: CollectionEntry<"blog">,
	posts: CollectionEntry<"blog">[],
	limit: number = 3,
): CollectionEntry<"blog">[] {
	const currentTags = currentPost.data.tags.map((tag) => slugify(tag));

	return posts
		.filter((post) => arePostsRelated(currentPost, post))
		.map((post) => {
			const relatedTags = post.data.tags.map((tag) => slugify(tag));
			const sharedTagCount = currentTags.filter((tag) => relatedTags.includes(tag)).length;

			return { post, sharedTagCount };
		})
		.sort((a, b) => {
			if (b.sharedTagCount !== a.sharedTagCount) {
				return b.sharedTagCount - a.sharedTagCount;
			}

			return new Date(b.post.data.pubDate).getTime() - new Date(a.post.data.pubDate).getTime();
		})
		.slice(0, limit)
		.map(({ post }) => post);
}

// --------------------------------------------------------
/**
 * * returns adjacent posts from a date-sorted posts array
 */
export function getAdjacentPosts(
	currentPost: CollectionEntry<"blog">,
	posts: CollectionEntry<"blog">[],
): {
	previousPost?: CollectionEntry<"blog">;
	nextPost?: CollectionEntry<"blog">;
} {
	const currentPostIndex = posts.findIndex((post) => getPostSlug(post) === getPostSlug(currentPost));

	if (currentPostIndex === -1) {
		return {};
	}

	return {
		previousPost: posts[currentPostIndex + 1],
		nextPost: posts[currentPostIndex - 1],
	};
}

// --------------------------------------------------------
/**
 * * returns an array of processed items, sorted by count
 * @param items: string[] - array of items to count and sort
 * note: return looks like { productivity: 2, 'cool-code': 1 }
 */

export function countItems(items: string[]): object {
	// get counts of each item in the array
	const countedItems = items.reduce((acc, item) => {
		const val = acc[slugify(item)] || 0;

		return {
			...acc,
			[slugify(item)]: val + 1,
		};
	}, {});

	return countedItems;
}

// --------------------------------------------------------
/**
 * * returns array of arrays, sorted by value (high value first)
 * @param jsObj: object - array of "key: value" pairs to sort
 * note: return looks like [ [ 'productivity', 2 ], [ 'cool-code', 1 ] ]
 * note: this is used for tag and category cloud ordering
 */
export function sortByValue(jsObj: object): any[] {
	const array: any[] = [];
	for (const i in jsObj) {
		array.push([i, jsObj[i]]);
	}

	const sorted = array.sort((a, b) => {
		return b[1] - a[1];
	});

	// looks like [ [ 'productivity', 2 ], [ 'cool-code', 1 ] ]
	return sorted;
}

// --------------------------------------------------------
/**
 * * returns all authors content collection data used in a blog post, gathered from the blog post authors slugs
 * @param authors: authors: CollectionEntry<"blog">["data"]["authors"] - array of authors slugs from a blog post
 * use like `const authorsData = await getAllAuthorsData();`
 */
export async function getAllAuthorsData(
	authors: CollectionEntry<"blog">["data"]["authors"],
): Promise<CollectionEntry<"authors">[]> {
	const authorsData = authors.map(async (author) => {
		const authorData = await getEntry("authors", author.id);

		if (authorData === undefined) {
			throw new Error(`Author "${author.id}" not found in "authors" collection.`);
		}

		return authorData;
	});

	// return a promise that is resolved when all promises in the array have been resolved
	return Promise.all(authorsData);
}

// --------------------------------------------------------
function sanitizePostSlug(slug: string): string {
	return slug.trim().replace(/^\/+|\/+$/g, "");
}

// --------------------------------------------------------
function validateUniquePostSlugs(posts: CollectionEntry<"blog">[]): void {
	const seen = new Map<string, string>();

	for (const post of posts) {
		const slug = getPostSlug(post);
		const existingPostId = seen.get(slug);

		if (existingPostId) {
			throw new Error(
				`Duplicate blog slug "${slug}" found for posts "${existingPostId}" and "${post.id}".`,
			);
		}

		seen.set(slug, post.id);
	}
}
