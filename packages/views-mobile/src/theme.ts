import { ThemeType } from "@web-desktop-environment/interfaces/lib/shared/settings";

export type ColorVariants = "main" | "dark" | "light" | "transparent";

export type Colors =
	| "background"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "error";

export interface Theme {
	type: ThemeType;
	background: Color;
	primary: Color;
	secondary: Color;
	success: Color;
	warning: Color;
	error: Color;
	windowBarColor: string;
	shadowColor: string;
	windowBorderColor: string;
}

export interface Color {
	main: string;
	dark: string;
	light: string;
	text: string;
	darkText?: string;
}

const transparentTheme: Theme = {
	type: "transparent",
	windowBarColor: "#BFBFBF57",
	shadowColor: "#0007",
	windowBorderColor: "#000",
	background: {
		main: "#BFBFBF27",
		light: "#EFEFEF67",
		dark: "#8F8F8F67",
		text: "#fff",
	},
	primary: {
		main: "#fff9",
		light: "#fffe",
		dark: "#eee7",
		text: "#000",
	},
	secondary: {
		main: "#0004",
		light: "#0003",
		dark: "#0005",
		text: "#fff",
	},
	error: {
		main: "#db5049ee",
		light: "#ff354c88",
		dark: "#f00",
		text: "#fff",
	},
	success: {
		main: "#21c62f88",
		dark: "#21c62fb8",
		light: "#21c62fee",
		text: "#fff",
	},
	warning: {
		main: "#ffd951",
		light: "#ffeb51",
		dark: "#ae9941",
		text: "#fff",
	},
};

const lightTheme: Theme = {
	type: "light",
	windowBarColor: "#fff",
	shadowColor: "#0007",
	windowBorderColor: "#5d6373bb",
	background: {
		main: "#f6f8fa",
		light: "#fff",
		dark: "#dadbdd",
		text: "#222",
	},
	primary: {
		main: "#fe8270",
		light: "#ff9270",
		dark: "#ce7250",
		text: "#000",
	},
	secondary: {
		main: "#4585b2",
		light: "#abcbe2",
		dark: "#357592",
		text: "#222",
	},
	error: {
		main: "#db5049ee",
		light: "#ff354c88",
		dark: "#f00",
		text: "#fff",
	},
	success: {
		main: "#21c62f88",
		dark: "#21c62fb8",
		light: "#21c62fee",
		text: "#fff",
	},
	warning: {
		main: "#ffd951",
		light: "#ffeb51",
		dark: "#ae9941",
		text: "#fff",
	},
};

const darkTheme: Theme = {
	type: "dark",
	shadowColor: "#0007",
	windowBorderColor: "#fff",
	windowBarColor: "#333333",
	background: {
		main: "#121212",
		light: "#424242",
		dark: "#010001",
		text: "#d9d9da",
	},
	primary: {
		main: "#5900e3",
		light: "#ac6bfb",
		dark: "#240068",
		text: "#f3e7fd",
	},
	secondary: {
		main: "#009591",
		dark: "#005456",
		light: "#00c4b4",
		text: "#c4fff4",
	},
	error: {
		main: "#db5049ee",
		light: "#ff354c88",
		dark: "#f00",
		text: "#fff",
	},
	success: {
		main: "#21c62f88",
		dark: "#21c62fb8",
		light: "#21c62fee",
		text: "#fff",
	},
	warning: {
		main: "#ffd951",
		light: "#ffeb51",
		dark: "#ae9941",
		text: "#fff",
	},
};

export const defaultTheme = darkTheme;

export const Themes = {
	dark: darkTheme,
	light: lightTheme,
	transparent: transparentTheme,
};
