/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@arcade/filmoji"],
	devIndicators: {
		// Hide the floating Next.js dev overlay icon
		buildActivity: false,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "encrypted-tbn0.gstatic.com",
			},
			{
				protocol: "https",
				hostname: "garticphone.com",
			},
			{
				protocol: "https",
				hostname: "athletesforkids.org",
			},
			{
				protocol: "https",
				hostname: "m.media-amazon.com",
			},
			{
				protocol: "https",
				hostname: "image.tmdb.org",
			},
		],
	},
};

export default nextConfig;
