import { type CollectionEntry } from "astro:content";

import { getPostSlug } from "@js/blogUtils";

export function getPostSocialPreviewUrl(post: CollectionEntry<"blog">): string {
	return `/social-previews/blog/${getPostSlug(post)}.png`;
}
