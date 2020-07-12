import { ThemeType } from "@web-desktop-environment/interfaces/lib/shared/settings";

export interface Theme {
  type: ThemeType;
  background: Color;
  primary: Color;
  secondary: Color;
  success: Color;
  warning: Color;
  error: Color;
  windowShadow: string;
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
  windowShadow: "-10px 12px 20px -2px #0007",
  background: {
    main: "#BFBFBF67",
    light: "#EFEFEF67",
    dark: "#8F8F8F67",
    transparent: "#BFBFBF37",
    transparentDark: "#BFBFBF44",
    text: "#000",
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
    main: "#0003",
    light: "#0001",
    dark: "#0004",
    text: "#000",
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

const lightTheme: Theme = {
  type: "light",
  windowShadow: "-10px 12px 20px -2px #0007",
  background: {
    main: "#eee",
    light: "#fff",
    transparent: "#ddd6",
    dark: "#5d6373bb",
    text: "#222",
    darkText: "#fff",
  },
  primary: {
    main: "#eaeaeaee",
    light: "#fafaeaee",
    transparent: "#eaeaea77",
    transparentDark: "#eaeaea55",
    dark: "#e5e5e5",
    text: "#000",
  },
  secondary: {
    main: "#00dac6",
    light: "#40fac699",
    dark: "#008785",
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
  windowShadow: "-10px 12px 20px -2px #0007",
  background: {
    main: "#333333",
    light: "#444444",
    transparent: "#4b4b4b",
    dark: "#242424",
    text: "#d9d9da",
  },
  primary: {
    main: "#eee",
    transparent: "#fff3",
    light: "#fff",
    dark: "#bbb",
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

export const Themes = {
  dark: darkTheme,
  light: lightTheme,
  transparent: transparentTheme,
};
