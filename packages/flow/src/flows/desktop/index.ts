import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { apps } from "../apps";
import { createReflow } from "../..";
import { portManager } from "../..";
import window from "./window";
import themeProvider from "./../container/themeProvider";
import { OpenApp } from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { settingManager } from "./../..";

export default <Flow<ViewInterfacesType>>(async ({ view, views }) => {
  let openApps: OpenApp[] = [];
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
    openApps,
  });

  settingManager.emitter.on("onNewSettings", (settings) =>
    desktop.update({ background: settings.desktop.background })
  );

  desktop.on("setBackground", ({ background }) => {
    desktop.update({ background });
  });

  let appIndex = 0;
  desktop.on("launchApp", async (app) => {
    appIndex++;

    const handler = apps[app.flow];

    const newOpenApp: OpenApp = {
      icon: handler.icon,
      name: handler.name,
      port: await portManager.getPort(),
      id: appIndex,
    };

    createReflow(newOpenApp.port)
      .start(themeProvider, {
        childFlow: window,
        childInput: {
          app: handler,
          appParams: {},
        },
      })
      .then(() => {
        openApps = openApps.filter((app) => app.id !== newOpenApp.id);
        desktop.update({ openApps });
      });

    openApps.push(newOpenApp);
    desktop.update({ openApps });
  });

  await desktop;
});
