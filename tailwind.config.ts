import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				primary: "#00F4F2",
				secondary: "#FF2A54",
				"background-50": "#F6F6F2",
				"background-100": "#333333",
				text: "#3E334E",
				hovered: "#388087",
			},
		},
		screens: {
			'mobile': '320px',
			'mobile2' : '425px',
			'sm': '640px',
			'md': '1024px',
			'lg': '1280px',
		}
	},
	plugins: [nextui()],
};
export default config;
