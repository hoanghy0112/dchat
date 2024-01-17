/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				pathname: "/v0/b/dchat-ecdc3.appspot.com/o/**",
			},
		],
	},
};

module.exports = nextConfig;
