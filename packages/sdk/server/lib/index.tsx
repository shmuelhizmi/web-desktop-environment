import React from "react";
import { Render } from "@react-fullstack/render";
import { createSocketServer } from "@react-fullstack/fullstack-socket-server";
import { Server as ServerBase } from "@react-fullstack/fullstack/server";
import { PackageJSON } from "@web-desktop-environment/interfaces/lib/shared/package";
import Desktop from "./components/desktop";
import DesktopManager from "./managers/desktopManager";
import Logger from "./utils/logger";
import { AppProvider } from "./contexts";

const rootLogger = new Logger();

const desktopManager = new DesktopManager("desktop-manager", rootLogger);

const Server = createSocketServer(ServerBase);

export const startServer = async (
	packageJSON: PackageJSON,
	packageJSONPath: string
) => {
	const { desktopPort } = await desktopManager.initialize(
		packageJSON,
		packageJSONPath
	);
	Render(
		<Server singleInstance port={desktopPort}>
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
