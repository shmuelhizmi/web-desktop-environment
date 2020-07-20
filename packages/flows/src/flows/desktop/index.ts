import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { apps } from "@apps/index";
import { defaultFlowInput } from "@managers/desktopManager";

export default <Flow<ViewInterfacesType, defaultFlowInput>>(async ({
	view,
	views,
	input: { desktopManager, parentLogger },
}) => {
	const logger = parentLogger.mount("desktop");
	const desktop = view(0, views.desktop, {
		background: desktopManager.settingsManager.settings.desktop.background, //random image
		apps: Object.keys(apps).map((flow) => {
			const { name, description, icon } = apps[flow];
			return {
				name,
				description,
				icon,
				flow,
			};
		}),
		openApps: desktopManager.windowManager.runningApps.map((app) => ({
			icon: app.icon,
			id: app.id,
			name: app.name,
			port: app.port,
		})),
	});

	desktopManager.settingsManager.emitter.on("onNewSettings", (settings) =>
		desktop.update({ background: settings.desktop.background })
	);

	desktopManager.windowManager.emitter.on("onAppsUpdate", (openApps) => {
		desktop.update({
			openApps: openApps.map((app) => ({
				icon: app.icon,
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

	await desktop;
});
