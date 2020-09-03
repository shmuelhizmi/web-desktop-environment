import React from "react";
import DesktopManager from "@managers/desktopManager";
import Logger from "@utils/logger";

export const AppProvider = React.createContext<{
	desktopManager: DesktopManager;
	logger: Logger;
}>(undefined);
