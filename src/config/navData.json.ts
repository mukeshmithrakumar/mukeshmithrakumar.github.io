export interface navLinkItem {
	text: string;
	href: string;
	newTab?: boolean; // adds target="_blank" rel="noopener noreferrer" to link
}

export interface navDropdownItem {
	text: string;
	dropdown: navLinkItem[];
}

export type navItem = navLinkItem | navDropdownItem;

// note: 1 level of dropdown is supported
const navConfig: navItem[] = [
	{
		text: "Blog",
		href: "/blog/",
	},
	{
		text: "Projects",
		href: "/projects/",
	},
];

export default navConfig;
