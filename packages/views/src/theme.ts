import { ThemeType } from "@web-desktop-environment/interfaces/lib/shared/settings";

export interface Theme {
  type: ThemeType;
  background: Color;
  primary: Color;
  secondary: Color;
  success: Color;
  warning: Color;
  error: Color;
}

export interface Color {
  main: string;
  transparent?: string;
  transparentDark?: string;
  dark: string;
  text: string;
}

const transparentTheme: Theme = {
  type: "transparent",
  background: {
    main: "#BFBFBF67",
    dark: "#8F8F8F67",
    transparent: "#BFBFBF37",
    transparentDark: "#BFBFBF44",
    text: "#000",
  },
  primary: {
    main: "#fff9",
    dark: "#eee7",
    transparent: "#fff2",
    transparentDark: "#fff4",
    text: "#000",
  },
  secondary: {
    main: "#0003",
    dark: "#0004",
    text: "#000",
  },
  error: {
    main: "#f7252c88",
    dark: "#f00",
    text: "#fff",
  },
  success: {
    main: "#21c62f88",
    dark: "#21c62fee",
    text: "#fff",
  },
  warning: {
    main: "#ffd951",
    dark: "#ae9941",
    text: "#fff",
  },
};

const lightTheme: Theme = {
  type: "light",
  background: {
    main: "#fff",
    dark: "#eee",
    text: "#fff",
  },
  primary: {
    main: "#eaeaeaee",
    transparent: "#eaeaea77",
    transparentDark: "#eaeaea55",
    dark: "#e5e5e5",
    text: "#000",
  },
  secondary: {
    main: "#00dac6",
    dark: "#008785",
    text: "#fff",
  },
  error: {
    main: "#b50026ee",
    dark: "#b50026",
    text: "#fff",
  },
  success: {
    main: "#21c62f88",
    dark: "#21c62fee",
    text: "#fff",
  },
  warning: {
    main: "#ffd951",
    dark: "#ae9941",
    text: "#fff",
  },
};

const darkTheme: Theme = {
  type: "dark",
  background: {
    main: "#202124",
    dark: "#101114",
    text: "#fff",
  },
  primary: {
    main: "#315bef",
    transparent: "#315bef77",
    dark: "#214b9f",
    text: "#fff",
  },
  secondary: {
    main: "#ef7df999",
    dark: "#ef7df9",
    text: "#fff",
  },
  error: {
    main: "#f7252c88",
    dark: "#f00",
    text: "#fff",
  },
  success: {
    main: "#21c62f88",
    dark: "#21c62fee",
    text: "#fff",
  },
  warning: {
    main: "#ffd951",
    dark: "#ae9941",
    text: "#fff",
  },
};

export const Themes = {
  dark: darkTheme,
  light: lightTheme,
  transparent: transparentTheme,
};
