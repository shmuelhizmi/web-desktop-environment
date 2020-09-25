import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";

export type ColorVariants =
	| "main"
	| "dark"
	| "light"
	| "transparent"
	| "transparentDark"
	| "transparentLight";

export type Colors =
	| "background"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "error";

export { Theme };

const transparentTheme: Theme = {
	type: "transparent",
	windowBarColor: "#BFBFBF57",
	shadowColor: "#0007",
	windowBorderColor: "#000",
	background: {
		main: "#BFBFBF27",
		light: "#EFEFEF67",
		dark: "#8F8F8F67",
		transparent: "#BFBFBF37",
		transparentDark: "#BFBFBF44",
		text: "#fff",
	},
	primary: {
		main: "#fff9",
		light: "#fffe",
		dark: "#eee7",
		transparent: "#fff2",
		transparentDark: "#fff4",
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
		transparent: "#21c62f48",
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
	primary: {
		main: "#eee9",
		light: "#fffe",
		dark: "#bbb7",
		transparent: "#bebebe22",
		transparentDark: "#bebebe44",
		text: "#000",
	},
	secondary: {
		main: "#315bef44",
		light: "#214b9f33",
		transparent: "#315bef22",
		dark: "#214b9f55",
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
		transparent: "#21c62f48",
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
	windowBorderColor: "#000",
	shadowColor: "#33333377",
	success: {
		main: "#21c62f88",
		dark: "#21c62fb8",
		light: "#21c62fee",
		text: "#fff",
		darkText: "#c73898",
		transparentLight: "#444",
		transparent: "#37c56676",
		transparentDark: "#37c5666a",
	},
	windowBarColor: "#fff",
	error: {
		main: "#db5049ee",
		light: "#ff354c88",
		dark: "#f00",
		text: "#fff",
		darkText: "#24adb4",
		transparentLight: "#fff",
		transparent: "#db50498f",
		transparentDark: "#db504981",
	},
	warning: {
		main: "#ffd951",
		light: "#ffeb51",
		dark: "#ae9941",
		text: "#fff",
		darkText: "#0025ab",
		transparentLight: "#444",
		transparent: "#ffd95199",
		transparentDark: "#ffd9518a",
	},
};

const darkTheme: Theme = {
	type: "dark",
	shadowColor: "#0007",
	windowBorderColor: "#000",
	windowBarColor: "#333333",
	background: {
		main: "#333333",
		light: "#444444",
		transparent: "#373737e9",
		dark: "#242424",
		transparentDark: "#24242499",
		text: "#d9d9da",
	},
	primary: {
		main: "#eee",
		transparent: "#e8e8e869",
		light: "#fff",
		dark: "#bbb",
		transparentDark: "#bebebe99",
		text: "#000",
	},
	secondary: {
		main: "#315bef",
		dark: "#214b9f",
		light: "#416bef",
		transparent: "#315bef97",
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

export const defaultTheme = darkTheme;

export const Themes = {
	dark: darkTheme,
	light: lightTheme,
	transparent: transparentTheme,
	transparentDark: transparentDarkTheme,
};
