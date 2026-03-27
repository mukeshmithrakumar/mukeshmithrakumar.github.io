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
	name: "Quantum",
	// Your website's title and description (meta fields)
	title: "Quantum - the tech portfolio theme crafted with Astro and Tailwind CSS",
	description:
		"The perfect portfolio website theme for developers, designed using Astro and Tailwind CSS. Perfect for freelancers, developers, startups, and personal use.",
	useViewTransitions: true,
	useAnimations: true,

	socialLinks: [
		{
			platform: "twitter",
			link: "https://twitter.com/BowTiedWebReapr",
		},
		{
			platform: "instagram",
			link: "https://www.instagram.com/bowtiedwebreaper/",
		},
		{
			platform: "github",
			link: "https://github.com/Boston343",
		},
		{
			// you should always at least have an email
			platform: "email",
			link: "mailto:creator@cosmicthemes.com",
		},
	],

	// Your information for blog post purposes
	author: {
		name: "Web Reaper",
		email: "creator@cosmicthemes.com",
		twitter: "BowTiedWebReapr",
	},

	// default image for meta tags if the page doesn't have an image already
	defaultImage: {
		src: "/images/cosmic-themes-logo.jpg",
		alt: "Stellar logo",
	},
};

export default siteData;
