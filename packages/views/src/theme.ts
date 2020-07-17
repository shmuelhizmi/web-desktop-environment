import { ThemeType } from "@web-desktop-environment/interfaces/lib/shared/settings";

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

export interface Theme {
  type: ThemeType;
  background: Color;
  primary: Color;
  secondary: Color;
  success: Color;
  warning: Color;
  error: Color;
  shadowColor: string;
  windowBorderColor: string;
}

export interface Color {
  main: string;
  transparent?: string;
  transparentLight?: string;
  transparentDark?: string;
  dark: string;
  light: string;
  text: string;
  darkText?: string;
}

const transparentTheme: Theme = {
  type: "transparent",
  shadowColor: "#0007",
  windowBorderColor: "#000",
  background: {
    main: "#BFBFBF57",
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
    main: "#f7252c88",
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
  shadowColor: "#0007",
  windowBorderColor: "#5d6373bb",
  background: {
    main: "#eee",
    light: "#fff",
    transparent: "#fff9",
    transparentDark: "#5d637399",
    dark: "#5d6373bb",
    text: "#222",
    darkText: "#fff",
  },
  primary: {
    main: "#444444",
    light: "#555555",
    transparent: "#55555599",
    dark: "#333333",
    transparentDark: "#33333388",
    text: "#fff",
  },
  secondary: {
    main: "#4585b2",
    transparent: "#4585b288",
    transparentDark: "#35759299",
    light: "#abcbe2",
    dark: "#357592",
    text: "#222",
  },
  error: {
    main: "#f7252c88",
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
  windowBorderColor: "#000",
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
    transparent: "#e8e8e899",
    light: "#fff",
    dark: "#bbb",
    transparentDark: "#bebebe99",
    text: "#000",
  },
  secondary: {
    main: "#315bef",
    dark: "#214b9f",
    light: "#416bef",
    transparent: "#315bef77",
    text: "#fff",
  },
  error: {
    main: "#f7252c88",
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
