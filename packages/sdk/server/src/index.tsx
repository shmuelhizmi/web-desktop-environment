import React from "react";
import { Render } from "@react-fullstack/render";
import { Server } from "@react-fullstack/fullstack-socket-server";
import { viewInterfaces } from "@web-desktop-environment/interfaces";
import Desktop from "@desktop/index";
import DesktopManager from "@managers/desktopManager";
import Logger from "@utils/logger";
import { AppProvider } from "@root/contexts";

const rootLogger = new Logger();

const desktopManager = new DesktopManager("desktop-manager", rootLogger);

export const startServer = async () => {
	await desktopManager.settingsManager.initialize();
	await desktopManager.downloadManager.initialize();
	await desktopManager.packageManager.searchForNewPackages();
	const desktopPort = await desktopManager.portManager.getPort(true);
	rootLogger.info(`starting web-desktop-environment on port ${desktopPort}`);
	Render(
		<Server views={viewInterfaces} singleInstance port={desktopPort}>
			{() => (
				<AppProvider.Provider value={{ desktopManager, logger: rootLogger }}>
					<Desktop />
				</AppProvider.Provider>
			)}
		</Server>
	);
};
