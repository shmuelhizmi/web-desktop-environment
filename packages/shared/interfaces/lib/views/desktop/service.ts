import type { View } from "@react-fullstack/fullstack/shared";
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
  clickable?: boolean;
}

export default interface MediaPlayer extends View<Input> {}