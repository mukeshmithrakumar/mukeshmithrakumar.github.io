import { type CollectionEntry, getCollection } from "astro:content";

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
