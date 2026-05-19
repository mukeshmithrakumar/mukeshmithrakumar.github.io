import { type CollectionEntry, getCollection } from "astro:content";

import { getAllPosts } from "@js/blogUtils";

interface FormatProjectsOptions {
	sortByDate?: boolean;
	limit?: number;
}

export async function getAllProjects(): Promise<CollectionEntry<"projects">[]> {
	const projects = await getCollection("projects", ({ data }) => {
		return data.draft !== true;
	});

	return formatProjects(projects);
}

export function getProjectUrl(project: CollectionEntry<"projects">): string {
	return `/projects/${project.id}/`;
}

export function formatProjects(
	projects: CollectionEntry<"projects">[],
	{ sortByDate = true, limit = undefined }: FormatProjectsOptions = {},
): CollectionEntry<"projects">[] {
	const formattedProjects = [...projects];

	if (sortByDate) {
		formattedProjects.sort(
			(a: CollectionEntry<"projects">, b: CollectionEntry<"projects">) =>
				new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
		);
	}

	if (typeof limit === "number") {
		return formattedProjects.slice(0, limit);
	}

	return formattedProjects;
}

export function getAdjacentProjects(
	currentProject: CollectionEntry<"projects">,
	projects: CollectionEntry<"projects">[],
): {
	previousProject?: CollectionEntry<"projects">;
	nextProject?: CollectionEntry<"projects">;
} {
	const currentProjectIndex = projects.findIndex((project) => project.id === currentProject.id);

	if (currentProjectIndex === -1) {
		return {};
	}

	return {
		previousProject: projects[currentProjectIndex + 1],
		nextProject: projects[currentProjectIndex - 1],
	};
}

export async function getDeepDivePostsForProject(
	project: CollectionEntry<"projects">,
	limit: number = 3,
): Promise<CollectionEntry<"blog">[]> {
	const posts = await getAllPosts();

	return posts
		.filter((post) =>
			post.data.relatedProjects?.some((relatedProject) => relatedProject.id === project.id),
		)
		.sort((a, b) => {
			return new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime();
		})
		.slice(0, limit);
}
