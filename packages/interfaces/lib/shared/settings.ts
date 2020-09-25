export type ThemeType = "transparent" | "transparentDark" | "dark" | "light" | "custom";

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
	transparent?: string;
	transparentLight?: string;
	transparentDark?: string;
	dark: string;
	light: string;
	text: string;
	darkText?: string;
}

export interface Settings extends Record<string, unknown>{ //make sure settings is always a valid object
  desktop: {
    background: string;
    nativeBackground: string;
    theme: ThemeType;
    customTheme?: Theme;
  };
  network: {
    ports: {
      mainPort: number;
      startPort: number;
      endPort: number;
    };
  };
}
