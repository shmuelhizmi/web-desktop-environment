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

const transparentTheme: Theme = {
	type: "transparent",
	name: "transparent",
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
	windowBorder: false,
};

const transparentDarkTheme: Theme = {
	type: "transparent",
	name: "transparent dark",
	windowBarColor: "#33333377",
	shadowColor: "#0007",
	windowBorderColor: "#eee4",
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
	windowBorder: true,
};

const lightTheme: Theme = {
	type: "light",
	name: "light",
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
	windowBorder: true,
};

const darkTheme: Theme = {
	type: "dark",
	name: "dark",
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
	windowBorder: true,
};

const mintTheme: Theme = {
	type: "dark",
	name: "flat mint",
	shadowColor: "#0000",
	windowBorderColor: "#000",
	windowBarColor: "#2e2e2e",
	background: {
		main: "#2e2e2e",
		light: "#404040",
		transparent: "#2e2e2ee9",
		dark: "#242424",
		transparentDark: "#24242499",
		text: "#d6d6d6",
	},
	primary: {
		main: "#e3e3e3",
		transparent: "#e3e3e369",
		light: "#fff",
		dark: "#d6d6d6",
		transparentDark: "#d6d6d699",
		text: "#000",
	},
	secondary: {
		main: "#90b376",
		dark: "#5da541",
		light: "#9ad96c",
		transparent: "#90b37697",
		text: "#fafcfb",
	},
	error: {
		main: "#db5049ee",
		light: "#ff354c88",
		dark: "#f00",
		text: "#fff",
	},
	success: {
		main: "#90b376",
		dark: "#5da541",
		light: "#9ad96c",
		transparent: "#90b37697",
		text: "#fafcfb",
	},
	warning: {
		main: "#ffd951",
		light: "#ffeb51",
		dark: "#ae9941",
		text: "#fff",
	},
	windowBorder: true,
	overrides: {
		WindowBar: {
			windowsBar: {
				bottom: 0,
				borderRadius: 0,
				background: "#2e2e2e",
				justifyContent: "center",
				width: "max-content",
				paddingLeft: 0,
				transform: "translateX(50%)",
				right: "50%",
				left: "auto",
			},
			"@keyframes slideUp": {
				from: {
					bottom: -55,
				},
				to: {
					bottom: 0,
				},
			},
			windowsBarButton: {
				margin: 0,
				marginLeft: 0,
				marginRight: 0,
				boxShadow: "none",
				borderRadius: 0,
			},
			windowsBarButtonCloseMinimized: {
				borderBottom: "#5da541 solid 1px",
			},
			windowsBarButtonOpen: {
				borderBottom: "#5da541 solid 1px",
			},
		},
		Desktop: {
			startMenu: {
				transform: "translateX(50%)",
				right: "50%",
				left: "auto",
				bottom: 60,
				borderRadius: 0,
				boxShadow: "none",
				background: "#2e2e2e",
			},
			appCell: {
				borderRadius: 0,
				borderBottom: "none",
			},
			slideIn: {
				animation: "none",
			},
			slideOut: {
				animation: "none",
			},
		},
		Window: {
			bar: {
				borderRadius: 0,
			},
			barCollapse: {
				borderRadius: 0,
			},
			barButton: {
				borderRadius: 0,
			},
			barButtonInactive: {
				border: "none",
			},
			body: {
				borderRadius: 0,
			},
		},
		Terminal: {
			root: {
				borderRadius: 0,
			},
		},
		LoadingScreen: {
			root: {
				borderRadius: 0,
			},
		},
		Iframe: {
			root: {
				borderRadius: 0,
			},
		},
		Notepad: {
			root: {
				borderRadius: 0,
			},
			headline: {
				borderRadius: 0,
			},
			backButton: {
				borderRadius: "0  !important",
			},
		},
		Explorer: {
			root: {
				borderRadius: 0,
			},
			actionBar: {
				borderRadius: 0,
			},
			file: {
				borderRadius: 0,
			},
			breadcrumbButtonItemFirst: {
				borderRadius: 0,
			},
			breadcrumbButtonItemLast: {
				borderRadius: 0,
			},
		},
		Settings: {
			root: {
				borderRadius: 0,
			},
			categorySelection: {
				borderRadius: 0,
			},
			settingsBlock: {
				borderRadius: 0,
			},
			category: {
				borderRadius: 0,
			},
			themeButton: {
				borderRadius: "0 !important",
			},
		},
	},
};

const nordTheme: Theme = {
	type: "dark",
	name: "nord",
	shadowColor: "#0006",
	windowBorderColor: "#292f3c",
	windowBarColor: "#3d4455",
	background: {
		main: "#3d4455",
		light: "#434c5e",
		transparent: "#3d4455e9",
		dark: "#2e3440",
		transparentDark: "#2e344099",
		text: "#eee",
	},
	primary: {
		main: "#2e343f",
		transparent: "#2e343f69",
		light: "#3b4251",
		dark: "#262b34",
		transparentDark: "#262b3499",
		text: "#fff",
	},
	secondary: {
		main: "#8fbcbb",
		dark: "#6f8a91",
		light: "#8abbb9",
		transparent: "#8fbcbb97",
		text: "#fff",
	},
	error: {
		main: "#c6616c",
		light: "#c6616c88",
		dark: "#b65e5c",
		text: "#fff",
	},
	success: {
		main: "#9dbd90",
		dark: "#9dbd90b8",
		light: "#9dbd90ee",
		text: "#fff",
	},
	warning: {
		main: "#ffd951",
		light: "#ffeb51",
		dark: "#ae9941",
		text: "#fff",
	},
	windowBorder: true,
};

export const defaultTheme = darkTheme;

export const Themes = {
	dark: darkTheme,
	nord: nordTheme,
	light: lightTheme,
	transparent: transparentTheme,
	transparentDark: transparentDarkTheme,
	mint: mintTheme,
};
