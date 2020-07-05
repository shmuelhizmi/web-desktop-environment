import { ViewInterface } from "@mcesystems/reflow";
import { Icon } from "../shared/icon";

export interface OpenApp {
  port: number;
  name: string;
  icon: Icon;
  id: number;
}

export interface App {
  name: string;
  flow: string;
  icon: Icon;
  description: string;
}

export interface Input {
  background: string;
  apps: App[];
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
