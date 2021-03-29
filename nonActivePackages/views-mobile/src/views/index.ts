import Desktop from "@views/Desktop";
import Window from "@views/Window";

import ThemeProvider from "@views/wrapper/ThemeProvider";

//apps
//import terminal from "@views/apps/utils/terminal";
//import explorer from "@views/apps/utils/explorer";
// system
import Settings from "@views/apps/system/Settings";

export const desktopViews = {
	Desktop,
	ThemeProvider,
};
export const appViews = {
	Settings,
	Window,
	ThemeProvider: ({ children }: { children: JSX.Element }) => children,
};
