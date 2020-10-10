import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";

export type ColorVariants = "main" | "dark" | "light" | "transparent";

export type Colors =
	| "background"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "error";

const transparentDarkTheme: Theme = {
	type: "transparent",
	windowBarColor: "#33333377",
	shadowColor: "#0007",
	windowBorderColor: "#000",
	background: {
		main: "#33333357",
		light: "#44444477",
		dark: "#24242477",
		transparent: "#37373747",
		transparentDark: "#24242444",
		text: "#d9d9da",
	},
	secondary: {
		main: "#eee",
		light: "#fffe",
		dark: "#bbb",
		transparent: "#bebebe22",
		transparentDark: "#bebebe44",
		text: "#000",
	},
	primary: {
		main: "#315bef",
		light: "#214b9f",
		transparent: "#315bef22",
		dark: "#214b9f",
		text: "#fff",
	},
	error: {
		main: "#db5049",
		light: "#ff354c",
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
		main: "#efd951",
		light: "#ffeb51",
		dark: "#ae9941",
		text: "#fff",
	},
	windowBorder: false,
};

const transparentTheme: Theme = {
	type: "transparent",
	windowBarColor: "#BFBFBF57",
	shadowColor: "#0007",
	windowBorderColor: "#000",
	windowBorder: false,
	background: {
		main: "#BFBFBF47",
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
		main: "#111",
		light: "#252525",
		dark: "#000",
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
		main: "#efd951",
		light: "#ffeb51",
		dark: "#ae9941",
		text: "#fff",
	},
};

const lightTheme: Theme = {
	type: "light",
	windowBarColor: "#fff",
	shadowColor: "#0007",
	windowBorder: false,
	windowBorderColor: "#5d6373bb",
	background: {
		main: "#f5f5f4",
		dark: "#e4e9f2",
		light: "#fff",
		text: "#222",
		darkText: "#000",
		transparentLight: "#fff",
		transparent: "#fff9",
		transparentDark: "#e4e9f299",
	},
	primary: {
		main: "#333333",
		dark: "#242424",
		light: "#444444",
		text: "#d9d9da",
		darkText: "#de2cb7",
		transparentLight: "#444",
		transparent: "#373737e9",
		transparentDark: "#24242499",
	},
	secondary: {
		main: "#4585b2",
		dark: "#357592",
		light: "#abcbe2",
		text: "#222",
		darkText: "#29d436",
		transparentLight: "#fff",
		transparent: "#4585b288",
		transparentDark: "#35759299",
	},
	error: {
		main: "#db5049",
		light: "#ff354c",
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
		main: "#efd951",
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
	windowBorder: false,
	background: {
		main: "#21272b",
		light: "#31373b",
		dark: "#11171b",
		text: "#d9d9da",
	},
	primary: {
		main: "#315bef",
		dark: "#214b9f",
		light: "#416bef",
		text: "#f3e7fd",
	},
	secondary: {
		main: "#009591",
		dark: "#005456",
		light: "#00c4b4",
		text: "#c4fff4",
	},
	error: {
		main: "#db5049",
		light: "#ff354c",
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
		main: "#efd951",
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
	transparentDark: transparentDarkTheme,
};
