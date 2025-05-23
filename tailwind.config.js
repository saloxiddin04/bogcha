/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
	],
	darkMode: ["class", '[data-theme="dark"]'],
	theme: {
		extend: {
			colors: {
				'primary': "#0053C7"
			}
		},
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	daisyui: {
		themes: [
			{
				light: {
					primary: "#0053C7",
					secondary: "#E4FF80", // sariq (yorug‘lik uchun yaxshi kontrast)
					accent: "#37cdbe",
					neutral: "#3d4451",
					"base-100": "#ffffff",
					info: "#3abff8",
					success: "#22c55e",
					warning: "#facc15",
					error: "#ef4444",
				},
			},
			{
				dark: {
					primary: "#0053C7",
					secondary: "#E4FF80", // bir oz yumshoqroq sariq
					accent: "#2dd4bf",
					neutral: "#191D24",
					"base-100": "#1F2937", // ko‘proq qorong‘i fon
					info: "#0ea5e9",
					success: "#22c55e",
					warning: "#eab308",
					error: "#dc2626",
				},
			},
		],
	},
}
