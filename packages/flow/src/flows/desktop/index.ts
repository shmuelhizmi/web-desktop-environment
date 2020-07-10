import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { apps } from "../apps";
import { createReflow } from "../..";
import { portManager } from "../shared/utils/checkPort";
import window from "./window";
import { OpenApp } from "@web-desktop-environment/interfaces/lib/views/Desktop";

export default <Flow<ViewInterfacesType>>(async ({ view, views }) => {
  let openApps: OpenApp[] = [];
  const desktop = view(0, views.desktop, {
    background: "url(https://picsum.photos/1920/1080)", //random image
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
      .start(window, {
        app: handler,
        appParams: {},
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
