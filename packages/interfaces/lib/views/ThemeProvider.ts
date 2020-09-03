import { View } from "@react-fullstack/fullstack";
import { ThemeType, Theme } from "../shared/settings";

export interface Input {
  theme: ThemeType;
  customTheme?: Theme;
}

export default interface ThemeProvider extends View<Input> {}
