import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { apps } from "../apps";
import { settingManager, rootLogger, windowManager } from "./../..";

export default <Flow<ViewInterfacesType>>(async ({ view, views }) => {
  const logger = rootLogger.mount("desktop");
  const desktop = view(0, views.desktop, {
    background: settingManager.settings.desktop.background, //random image
    apps: Object.keys(apps).map((flow) => {
      const { name, description, icon } = apps[flow];
      return {
        name,
        description,
        icon,
        flow,
      };
    }),
    openApps: windowManager.runningApps.map((app) => ({
      icon: app.icon,
      id: app.id,
      name: app.name,
      port: app.port,
    })),
  });

  settingManager.emitter.on("onNewSettings", (settings) =>
    desktop.update({ background: settings.desktop.background })
  );

  windowManager.emitter.on("onAppsUpdate", (openApps) => {
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
    windowManager.spawnApp(app.flow, app.params);
  });

  await desktop;
});
