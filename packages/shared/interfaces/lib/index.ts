import type Desktop from "./views/Desktop";
import type Window from "./views/Window";
import type ThemeProvider from "./views/ThemeProvider";
// apps

// utils
import type Terminal from "./views/apps/utils/Terminal";
import type Explorer from "./views/apps/utils/Explorer";

// file viewers
import type Notepad from "./views/apps/utils/Notepad";
import type MediaPlayer from "./views/apps/media/MediaPlayer";

// system
import type Settings from "./views/apps/system/Settings";

// third party
import type Iframe from "./views/apps/thirdParty/Iframe";

// shared app screens
import type LoadingScreen from "./views/apps/shared/LoadingScreen";

import type Service from "./views/desktop/service";

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
  LoadingScreen: <LoadingScreen>{},
  // wrapper
  ThemeProvider: <ThemeProvider>{},
  Service: <Service>{},
};

export type ViewInterfacesType = typeof viewInterfaces;
