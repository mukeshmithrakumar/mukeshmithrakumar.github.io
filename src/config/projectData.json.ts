export interface ProjectItem {
	image: ImageMetadata; // an imported image
	title: string;
	description: string;
	href: URL;
}

// images
import CosmicThemes from "@images/projects/cosmic-themes.png";
import Galaxy from "@images/projects/galaxy.png";
import Stellar from "@images/projects/stellar.png";
import TheVoid from "@images/projects/the-void.png";

export const projectData: ProjectItem[] = [
	{
		image: CosmicThemes,
		title: "Cosmic Themes",
		description: `Production-ready website templates crafted with Astro and Tailwind CSS. 
    These are designed to save you weeks of time and get websites up and running in minutes.
    `,
		href: new URL("https://cosmicthemes.com/"),
	},
	{
		image: Galaxy,
		title: "Galaxy",
		description: `A stunning SaaS theme for Astro to introduct your next startup. 
    It features a modern glow design with all the features you need.
    `,
		href: new URL("https://cosmicthemes.com/themes/galaxy/"),
	},
	{
		image: Stellar,
		title: "Stellar",
		description: `A playful small business theme and blog for Astro, featuring fun free-hand illustrations and colorful blobs. 
    This is perfect to use for any small businesses or personal blogs.
    `,
		href: new URL("https://cosmicthemes.com/themes/stellar/"),
	},
	{
		image: TheVoid,
		title: "The Void",
		description: `A sleek and modern blog template crafted with Astro and Tailwind CSS. 
    This has all the features you would want for a blog, such as tags, categories, pagination, newsletter signup, light and dark theme toggle, and more.
    `,
		href: new URL("https://cosmicthemes.com/themes/the-void/"),
	},
];

export default projectData;
