import { ViewInterface } from "@mcesystems/reflow";
import { Icon } from "../shared/icon";
import { Window } from "../shared/window";


export interface Input {
	title: string;
	name: string;
    icon: Icon;
    window: Window;
}

export interface Events {
  setWindowState: {
	minimized?: boolean;
	position?: { x: number; y: number }
  };
  launchApp: {
    flow: string;
    params: any;
  };
}

export interface Output {
}

export default interface Desktop extends ViewInterface<Input, Events, Output> {}
