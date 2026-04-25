import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// Type-check frontmatter using a schema
const blogCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Optional public URL slug for the post. Falls back to the content entry id if omitted.
			slug: z.string().optional(),
			description: z.string(),
			// reference the authors collection https://docs.astro.build/en/guides/content-collections/#defining-collection-references
			authors: z.array(reference("authors")),
			// Transform string to Date object
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.or(z.date())
				.optional()
				.transform((val) => (val ? new Date(val) : undefined)),
			heroImage: image(),
			tags: z.array(z.string()),
			series: z.string().optional(),
			seriesOrder: z.number().int().positive().optional(),
			relatedProjects: z.array(reference("projects")).optional(),
			// blog posts will be excluded from build if draft is "true"
			draft: z.boolean().optional(),
		}),
});

const projectsCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/projects" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.or(z.date())
				.optional()
				.transform((val) => (val ? new Date(val) : undefined)),
			heroImage: image(),
			client: z.string().optional(),
			role: z.string(),
			year: z.number().int().positive(),
			duration: z.string().optional(),
			projectUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
			repoUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
			// project pages will be excluded from build if draft is "true"
			draft: z.boolean().optional(),
		}),
});

// authors
const authorsCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/authors" }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			avatar: image(),
			about: z.string(),
			email: z.string(),
			authorLink: z.string(), // author page link. Could be a personal website, github, twitter, whatever you want
		}),
});

export const collections = {
	blog: blogCollection,
	projects: projectsCollection,
	authors: authorsCollection,
};
