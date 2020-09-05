import Desktop from "./views/Desktop";
import Window from "./views/Window";
import ThemeProvider from "./views/ThemeProvider";
// apps

// utils
import Terminal from "./views/apps/utils/Terminal";
import Explorer from "./views/apps/utils/Explorer";
import Notepad from "./views/apps/utils/Notepad";

// system
import Settings from "./views/apps/system/Settings";

export const viewInterfaces = {
  Desktop: <Desktop>{},
  Window: <Window>{},
  // apps
  Terminal: <Terminal>{},
  Explorer: <Explorer>{},
  Settings: <Settings>{},
  Notepad: <Notepad>{},
  // warpper
  ThemeProvider: <ThemeProvider>{},
};

export type ViewInterfacesType = typeof viewInterfaces;
