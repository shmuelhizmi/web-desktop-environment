import type { View } from "@react-fullstack/fullstack";
import { Icon } from "../../shared/icon";

export interface Input {
  icon: Icon;
  text: string;
  buttons: ServiceActionItem[];
  onAction(id: string): void;
}

export interface ServiceActionItem {
  text: string;
  id: string;
  icon: Icon;
}

export default interface MediaPlayer extends View<Input> {}