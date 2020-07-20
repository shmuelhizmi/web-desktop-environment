import { Reflow, Transports } from "@mcesystems/reflow";
import {
	ViewInterfacesType,
	viewInterfaces,
} from "@web-desktop-environment/interfaces/lib";
import desktop from "@desktop/index";
import themeProvider from "@container/themeProvider";
import DesktopManager from "@managers/desktopManager";
import Logger from "@utils/logger";

export const createReflow = (port: number) =>
	new Reflow<ViewInterfacesType>({
		transport: new Transports.WebSocketsTransport({ port }),
		views: viewInterfaces,
	});

const rootLogger = new Logger();

const desktopManager = new DesktopManager("desktop-manager", rootLogger);

desktopManager.settingsManager.initalize().then(() => {
	desktopManager.portManager
		.getPort(true)
		.then((port) => {
			const reflow = createReflow(port);
			rootLogger.info(`starting webOS on port ${port}`);
			reflow
				.start(themeProvider, {
					childFlow: desktop,
					parentLogger: rootLogger,
					desktopManager,
				})
				.then(() => {
					rootLogger.warn("app exist");
				});
		})
		.catch((e) => rootLogger.error((e && e.message) || e));
});
