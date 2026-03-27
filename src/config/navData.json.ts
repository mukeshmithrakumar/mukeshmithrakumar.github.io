// utils
import { getAllPosts, countItems, sortByValue } from "@js/blogUtils";
import { humanize } from "@js/textUtils";

// get the tags used in blog posts, to put into navbar
const posts = await getAllPosts();
const alltags = posts.map((post) => post.data.tags).flat();
const countedtags = countItems(alltags);
const processedtags = sortByValue(countedtags);

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
		text: "Overview",
		href: "/overview/",
	},
	{
		text: "Blog",
		href: "/blog/",
	},
	// {
	// 	// get the tags used in blog posts, to put into a navbar dropdown
	// 	text: "Tags",
	// 	dropdown: processedtags.map(([tag, count]) => {
	// 		return {
	// 			text: humanize(tag),
	// 			href: `/tags/${tag}/`,
	// 		};
	// 	}),
	// },
	{
		text: "Projects",
		href: "/projects/",
	},
	// {
	// 	text: "Pages",
	// 	dropdown: [
	// 		{
	// 			text: "Blog",
	// 			href: "/blog/",
	// 		},
	// 		// {
	// 		// 	text: "Projects",
	// 		// 	href: "/projects/",
	// 		// },
	// 		{
	// 			text: "Uses",
	// 			href: "/uses/",
	// 		},
	// 		{
	// 			text: "Elements",
	// 			href: "/elements/",
	// 		},
	// 	],
	// },
];

export default navConfig;
