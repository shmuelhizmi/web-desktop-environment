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

// third party
import Iframe from './views/apps/thirdParty/Iframe'

// shared app screens
import LoadingScreen from './views/apps/shared/LoadingScreen'

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
};

export type ViewInterfacesType = typeof viewInterfaces;
