import { View } from "@react-fullstack/fullstack";
import { Icon } from "../shared/icon";
import { Window } from "../shared/window";

export interface Input {
  title: string;
  name: string;
  icon: Icon;
  window: Window;
  background: string;
  setWindowState: (windowState: LastWindowState) => void;
  onClose: () => void;
}

export interface LastWindowState {
  minimized?: boolean;
  position?: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export default interface WindowViewInterface extends View<Input> {}
