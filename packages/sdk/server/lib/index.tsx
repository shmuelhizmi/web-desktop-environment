import React from "react";
import { Render } from "@react-fullstack/render";
import { Server } from "@react-fullstack/fullstack-socket-server";
import { viewInterfaces } from "@web-desktop-environment/interfaces";
import { PackageJSON } from "@web-desktop-environment/interfaces/lib/shared/package";
import Desktop from "./components/desktop";
import DesktopManager from "./managers/desktopManager";
import Logger from "./utils/logger";
import { AppProvider } from "./contexts";

const rootLogger = new Logger();

const desktopManager = new DesktopManager("desktop-manager", rootLogger);

export const startServer = async (packageJSON: PackageJSON, packageJSONPath: string) => {
	const { desktopPort } = await desktopManager.initialize(packageJSON, packageJSONPath);
	Render(
		<Server views={viewInterfaces} singleInstance port={desktopPort}>
			{() => (
				<AppProvider.Provider value={{ desktopManager, logger: rootLogger }}>
					<Desktop
						includeNativeX11Apps={!!packageJSON.wdeConfig?.includeNativeX11Apps}
					/>
				</AppProvider.Provider>
			)}
		</Server>
	);
};
