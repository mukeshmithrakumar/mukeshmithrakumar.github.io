export interface SocialLinkProps {
	platform:
		| "github"
		| "twitter"
		| "mastodon"
		| "linkedin"
		| "instagram"
		| "threads"
		| "facebook"
		| "youtube"
		| "twitch"
		| "tiktok"
		| "snapchat"
		| "reddit"
		| "pinterest"
		| "medium"
		| "dev"
		| "dribbble"
		| "behance"
		| "codepen"
		| "producthunt"
		| "discord"
		| "slack"
		| "whatsapp"
		| "telegram"
		| "email"; // you should always at least have an email
	link: string;
}

export interface SiteDataProps {
	name: string;
	title: string;
	description: string;
	googleSiteVerification?: string;
	useViewTransitions?: boolean;
	useAnimations?: boolean;
	socialLinks: SocialLinkProps[];
	author: {
		// used for blog post purposes
		name: string;
		email: string;
		twitter: string; // used for twitter cards when sharing a blog post on twitter
	};
	defaultImage: {
		src: string;
		alt: string;
	};
}

// Update this file with your site specific information
const siteData: SiteDataProps = {
	name: "Mukesh Mithrakumar",
	title: "Mukesh Mithrakumar - Machine Learning Engineer",
	description:
		"Looking for a Machine Learning Engineer for freelancing or consulting? View Mukesh Mithrakumar's website to see some of his works.",
	googleSiteVerification: "eC1HmS1z5BOVpsTd9QqC3BIhRvif2wgTUGWFKHt996c",
	useViewTransitions: true,
	useAnimations: true,

	socialLinks: [
		{
			platform: "linkedin",
			link: "https://www.linkedin.com/in/mukesh-mithrakumar/",
		},
		{
			platform: "github",
			link: "https://github.com/mukeshmithrakumar",
		},
		{
			platform: "twitter",
			link: "https://x.com/mithraics_",
		},
		{
			// you should always at least have an email
			platform: "email",
			link: "mailto:newsletter@mukesh.ai",
		},
	],

	// Your information for blog post purposes
	author: {
		name: "Mukesh Mithrakumar",
		email: "newsletter@mukesh.ai",
		twitter: "mithraics_",
	},

	// default image for meta tags if the page doesn't have an image already
	defaultImage: {
		src: "/images/astrum-logo-rectangle.png",
		alt: "Astrum AI Logo",
	},
};

export default siteData;
