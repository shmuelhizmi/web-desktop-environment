import { Icon } from "@web-desktop-environment/interfaces/lib/shared/icon";
import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces/lib";
import { terminal } from "./utils/terminal";
import { explorer } from "./utils/explorer";
import { Window } from "@web-desktop-environment/interfaces/lib/shared/window";

interface AppEvents {
	change_title: string;
}

export interface App<Params = {}> {
  icon: Icon;
  name: string;
  defaultInput: Params;
  description: string;
  window: Window;
  flow: Flow<ViewInterfacesType, Params, void, {}, {}, AppEvents>;
}

export const apps: {
  [app: string]: App;
} = {
  terminal,
  explorer,
};
