import type { View } from "@react-fullstack/fullstack/shared";
import type { ThemeType, Theme } from "../shared/settings";

export interface Input {
  theme: ThemeType;
  customTheme?: Theme;
}

export default interface ThemeProvider extends View<Input> {}
