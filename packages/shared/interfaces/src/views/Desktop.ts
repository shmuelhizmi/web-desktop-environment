import type { View } from "@react-fullstack/fullstack";
import type { Icon, NativeIcon } from "../shared/icon";

export interface OpenApp {
  port: number;
  name: string;
  icon: Icon;
  nativeIcon: NativeIcon;
  id: number;
}

export interface App {
  displayName: string;
  appName: string;
  icon: Icon;
  nativeIcon: NativeIcon;
  description: string;
}

export interface GTKBridge {
	port: number;
}

export interface Input {
  background: string;
  gtkBridge?: GTKBridge;
  nativeBackground: string;
  apps: App[];
  openApps: OpenApp[];
  onLaunchApp: (app: {
    name: string;
    params: any;
  }) => void;
  onCloseApp: (id: number) => void; // app id
}

export default interface Desktop extends View<Input> {}
