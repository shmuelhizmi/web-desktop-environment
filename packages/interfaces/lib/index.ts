import Desktop from "./views/Desktop";
import Window from "./views/Window";
import ThemeProvider from "./views/ThemeProvider";
// apps

// utils
import Terminal from "./views/apps/utils/Terminal";
import Explorer from "./views/apps/utils/Explorer";

// file viewers
import Notepad from "./views/apps/utils/Notepad";
import MediaPlayer from "./views/apps/media/MediaPlayer";

// system
import Settings from "./views/apps/system/Settings";

import Iframe from './views/apps/thirdParty/Iframe'

export const viewInterfaces = {
  Desktop: <Desktop>{},
  Window: <Window>{},
  // apps
  Terminal: <Terminal>{},
  Explorer: <Explorer>{},
  Settings: <Settings>{},
  Notepad: <Notepad>{},
  MediaPlayer: <MediaPlayer>{},
  Iframe: <Iframe>{},
  // wrapper
  ThemeProvider: <ThemeProvider>{},
};

export type ViewInterfacesType = typeof viewInterfaces;
