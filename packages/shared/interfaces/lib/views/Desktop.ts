import type { View } from "@react-fullstack/fullstack/shared";
import type { Icon } from "../shared/icon";

export interface OpenApp {
  port: number;
  name: string;
  icon: Icon;
  id: string;
}

export interface App {
  displayName: string;
  appName: string;
  icon: Icon;
  color?: string;
  description: string;
}

export interface GTKBridge {
	domain: string;
}

export interface Input {
  background: string;
  gtkBridge?: GTKBridge;
  nativeBackground: string;
  apps: App[];
  openApps: OpenApp[];
  servicesAppsDomains: string[];
  externalViewsImportPaths: string[];
  externalViewsHostDomain: string;
  onLaunchApp: (app: {
    name: string;
    params: any;
  }) => void;
  onCloseApp: (id: string) => void; // app id
}

export default interface Desktop extends View<Input> {}
