import { ViewInterface } from "@web-desktop-environment/reflow";
import { ThemeType } from "../shared/settings";

export interface Input {
  theme: ThemeType;
}

export default interface ThemeProvider extends ViewInterface<Input, {}, void> {}
