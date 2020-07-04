import { ViewInterface } from "@mcesystems/reflow";
import { Icon } from "../shared/icon";

export interface OpenApp {
  port: number;
  name: string;
  icon: Icon;
  id: number;
}

export interface Input {
  background: string;
  apps: string[];
  openApps: OpenApp[];
}

export interface Events {
  setBackground: {
    background: string;
  };
  launchApp: {
    flow: string;
    params: any;
  };
}

export interface Output {
}

export default interface Desktop extends ViewInterface<Input, Events, Output> {}
