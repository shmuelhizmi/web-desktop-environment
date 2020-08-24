import { Reflow, Transports } from "@web-desktop-environment/reflow";
import {
	ViewInterfacesType,
	viewInterfaces,
} from "@web-desktop-environment/interfaces/lib";
import desktop from "@desktop/index";
import DesktopManager from "@managers/desktopManager";
import Logger from "@utils/logger";
import {
	ThemeType,
	Theme,
} from "@web-desktop-environment/interfaces/lib/shared/settings";

export const createReflow = (
	port: number,
	theme: ThemeType,
	customTheme?: Theme
) =>
	new Reflow<ViewInterfacesType>({
		transport: new Transports.WebSocketsTransport({ port }),
		views: viewInterfaces,
		viewerParameters: { theme, customTheme },
	});

const rootLogger = new Logger();

const desktopManager = new DesktopManager("desktop-manager", rootLogger);

(async () => {
	await desktopManager.settingsManager.initalize();
	await desktopManager.downloadManager.initalize();
	const desktopPort = await desktopManager.portManager.getPort(true);
	const reflow = createReflow(
		desktopPort,
		desktopManager.settingsManager.settings.desktop.theme,
		desktopManager.settingsManager.settings.desktop.customTheme
	);
	rootLogger.info(`starting webOS on port ${desktopPort}`);
	reflow
		.start(desktop, {
			desktopManager,
			parentLogger: rootLogger,
		})
		.then(() => {
			rootLogger.warn("app exist");
		});
})();