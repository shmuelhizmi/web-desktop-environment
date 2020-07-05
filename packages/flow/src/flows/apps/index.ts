import { Icon } from "@web-desktop-environment/interfaces/lib/shared/icon";
import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces/lib";
import { terminal, vscodeServerScript } from "./utils/terminal";
import { Window } from "@web-desktop-environment/interfaces/lib/shared/window";

export interface App<Params = {}> {
  icon: Icon;
  name: string;
  defaultInput: Params;
  description: string;
  window: Window;
  flow: Flow<ViewInterfacesType, Params>;
}

export const apps: {
  [app: string]: App;
} = {
  terminal,
  vscodeServerScript,
};
