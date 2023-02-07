/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,css,svelte,ts}"],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	daisyui: {
		themes: [
			{
				unicourse: {
					...require("daisyui/src/colors/themes")["[data-theme=light]"],
					primary: "#9333ea",
					"primary-focus": "#7e22ce",
					"primary-content": "#ffffff",
					"base-content": "#9333ea",
				},
			},
		],
	},
};
