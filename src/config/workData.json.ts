export interface jobItem {
	company: string;
	title: string;
	dateRange: string; // "Jan 2019 - Present" or similar
}

// note: 1 level of dropdown is supported
const workData: jobItem[] = [
	{
		company: "HTMX",
		title: "CEO",
		dateRange: "2024 - Present",
	},
	{
		company: "Build-a-Bear Workshop",
		title: "Metaverse Architect",
		dateRange: "2021 - 2023",
	},
	{
		company: "Emojipedia",
		title: "Chief Emoji Officer",
		dateRange: "2013 - 2021",
	},
	{
		company: "Bitcoin",
		title: "Satoshi Nakamoto",
		dateRange: "2008 - 2009",
	},
];

export default workData;
