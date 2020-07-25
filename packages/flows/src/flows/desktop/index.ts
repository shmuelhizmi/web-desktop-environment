import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import * as apps from "@apps/index";
import { defaultFlowInput } from "@managers/desktopManager";

export default <Flow<ViewInterfacesType, defaultFlowInput>>(async ({
	view,
	views,
	viewerParameters,
	input: { desktopManager, parentLogger },
}) => {
	const logger = parentLogger.mount("desktop");
	const desktop = view(0, views.desktop, {
		background: desktopManager.settingsManager.settings.desktop.background, //random image
		nativeBackground:
			desktopManager.settingsManager.settings.desktop.nativeBackground, //random image
		apps: Object.keys(apps).map((flow) => {
			const { name, description, icon, nativeIcon } = apps[flow];
			return {
				name,
				nativeIcon,
				description,
				icon,
				flow,
			};
		}),
		openApps: desktopManager.windowManager.runningApps.map((app) => ({
			icon: app.icon,
			nativeIcon: app.nativeIcon,
			id: app.id,
			name: app.name,
			port: app.port,
		})),
	});

	desktopManager.settingsManager.emitter.on("onNewSettings", (settings) => {
		desktop.update({
			background: settings.desktop.background,
			nativeBackground: settings.desktop.nativeBackground,
		});
		viewerParameters({ theme: settings.desktop.theme });
	});

	desktopManager.windowManager.emitter.on("onAppsUpdate", (openApps) => {
		desktop.update({
			openApps: openApps.map((app) => ({
				icon: app.icon,
				nativeIcon: app.nativeIcon,
				id: app.id,
				name: app.name,
				port: app.port,
			})),
		});
	});

	desktop.on("launchApp", async (app) => {
		logger.info(`launch app flow ${app.flow}`);
		desktopManager.windowManager.spawnApp(app.flow, app.params);
	});

	desktop.on("closeApp", async (id) => {
		logger.info(
			`closing app flow ${
				desktopManager.windowManager.runningApps.find((app) => app.id === id)
					.name
			}`
		);
		desktopManager.windowManager.killApp(id);
	});

	await desktop;
});
