import { Reflow, Transports } from "@mcesystems/reflow";
import {
	ViewInterfacesType,
	viewInterfaces,
} from "@web-desktop-environment/interfaces/lib";
import desktop from "@desktop/index";
import DesktopManager from "@managers/desktopManager";
import Logger from "@utils/logger";
import { ThemeType } from "@web-desktop-environment/interfaces/lib/shared/settings";

export const createReflow = (port: number, theme: ThemeType) =>
	new Reflow<ViewInterfacesType>({
		transport: new Transports.WebSocketsTransport({ port }),
		views: viewInterfaces,
		viewerParameters: { theme },
	});

const rootLogger = new Logger();

const desktopManager = new DesktopManager("desktop-manager", rootLogger);

desktopManager.settingsManager.initalize().then(() => {
	desktopManager.portManager
		.getPort(true)
		.then((port) => {
			const reflow = createReflow(
				port,
				desktopManager.settingsManager.settings.desktop.theme
			);
			rootLogger.info(`starting webOS on port ${port}`);
			reflow
				.start(desktop, {
					desktopManager,
					parentLogger: rootLogger,
				})
				.then(() => {
					rootLogger.warn("app exist");
				});
		})
		.catch((e) => rootLogger.error((e && e.message) || e));
});
