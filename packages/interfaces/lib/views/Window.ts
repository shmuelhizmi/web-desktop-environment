import { ViewInterface } from "@web-desktop-environment/reflow";
import { Icon } from "../shared/icon";
import { Window } from "../shared/window";

export interface Input {
  title: string;
  name: string;
  icon: Icon;
  window: Window;
  background: string;
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

export interface Events {
  setWindowState: LastWindowState;
  launchApp: {
    flow: string;
    params: any;
  };
}

export interface Output {}

export default interface WindowViewInterface extends ViewInterface<Input, Events, Output> {}
