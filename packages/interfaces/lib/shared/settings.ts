export type ThemeType = "transparent" | "dark" | "light";

export interface Settings extends Record<string, unknown>{ //make sure settings is always a valid object
  desktop: {
    background: string;
    nativeBackground: string;
    theme: ThemeType;
  };
  network: {
    ports: {
      mainPort: number;
      startPort: number;
      endPort: number;
    };
  };
}
