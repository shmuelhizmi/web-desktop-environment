import { ViewInterface } from "@mcesystems/reflow";
import { Icon, NativeIcon } from "../shared/icon";

export interface OpenApp {
  port: number;
  name: string;
  icon: Icon;
  nativeIcon: NativeIcon;
  id: number;
}

export interface App {
  name: string;
  flow: string;
  icon: Icon;
  nativeIcon: NativeIcon;
  description: string;
}

export interface Input {
  background: string;
  nativeBackground: string;
  apps: App[];
  openApps: OpenApp[];
}

export interface Events {
  launchApp: {
    flow: string;
    params: any;
  };
  closeApp: number; // app id
}

export interface Output {}

export default interface Desktop extends ViewInterface<Input, Events, Output> {}
