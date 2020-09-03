import { View } from "@react-fullstack/fullstack";
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
  onLaunchApp: (app: {
    flow: string;
    params: any;
  }) => void;
  onCloseApp: (id: number) => void; // app id
}

export default interface Desktop extends View<Input> {}
