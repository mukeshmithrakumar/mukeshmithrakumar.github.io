export interface usesItem {
	sectionTitle: string;
	items: string[];
}

// note: 1 level of dropdown is supported
const usesData: usesItem[] = [
	{
		sectionTitle: "Coding Setup",
		items: [
			"Windsurf IDE - AI enabled IDE",
			"Git - version control",
			"Dracula - the one true theme for VSCode",
			"Fira Code - a freee monospaced font with helpful ligatures",
		],
	},
	{
		sectionTitle: "Programming",
		items: [
			"HTML / CSS / JS - the general web languages",
			"TypeScript - enhances javascript",
			"Astro - high speed framework",
			"Tailwind CSS - better CSS",
			"Keystatic CMS - git based content management system",
		],
	},
	{
		sectionTitle: "General Software",
		items: [
			"Spotify Premium - I need my music",
			"BitWarden - free password manager",
			"Obsidian - note taking app",
			"Brave Browser - daily browser with nice privacy tools",
			"Zoho Mail - mail client for professional use",
			"Gmail - personal mail client",
			"Discord - communication and technical discussion",
		],
	},
];

export default usesData;
