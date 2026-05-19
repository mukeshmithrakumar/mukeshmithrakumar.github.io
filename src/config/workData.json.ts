export interface jobItem {
	company: string;
	title: string;
	dateRange: string; // "Jan 2019 - Present" or similar
}

// note: 1 level of dropdown is supported
const workData: jobItem[] = [
	{
		company: "84.51°",
		title: "Lead ML Engineer",
		dateRange: "2024 - Present",
	},
	{
		company: "IQVIA",
		title: "Senior ML Engineer",
		dateRange: "2020 - 2024",
	},
	{
		company: "Astrum AI Solutions",
		title: "Founder and CTO",
		dateRange: "2018 - 2020",
	},
];

export default workData;
