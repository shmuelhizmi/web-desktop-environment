import Desktop from "./views/Desktop";
import Window from "./views/Window";
import ThemeProvider from "./views/ThemeProvider";
// apps

// utils
import Terminal from "./views/apps/utils/Terminal";
import Explorer from "./views/apps/utils/Explorer";

// system
import Settings from "./views/apps/system/Settings";

export const viewInterfaces = {
  desktop: <Desktop>{},
  window: <Window>{},
  // apps
  terminal: <Terminal>{},
  explorer: <Explorer>{},
  settings: <Settings>{},
  themeProvider: <ThemeProvider>{},
};

export type ViewInterfacesType = typeof viewInterfaces;
