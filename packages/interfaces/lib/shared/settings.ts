export type ThemeType = "transparent" | "dark" | "light";

export interface Settings {
  desktop: {
    background: string;
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
