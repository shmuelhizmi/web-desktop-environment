import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { apps } from "..";
import { createReflow } from "../..";
import { portIsAvilable } from "../shared/utils/checkPort";
import window from "./window";
import { OpenApp } from "@web-desktop-environment/interfaces/lib/views/Desktop";

export default <Flow<ViewInterfacesType>>(async ({ view, views }) => {
  // Using the view() function to display the MyView component, at layer 0 of this flow
  let openApps: OpenApp[] = [];
  const desktop = view(0, views.desktop, {
    background: "#5555cc",
    apps: Object.keys(apps),
    openApps,
  });

  desktop.on("setBackground", ({ background }) => {
    desktop.update({ background });
  });

  let appIndex = 0;
  let appStartingPort = 8010;
  desktop.on("launchApp", async (app) => {
    // need to update to a app finder
    const newOpenApp: OpenApp = {
      icon: { type: "fluentui", icon: "Calculator" },
      name: "Calculator",
      port: appStartingPort + appIndex,
      id: appIndex,
    };

    // check port avilablility
    let portAvilable = false;
    while (!portAvilable) {
      portAvilable = await portIsAvilable(appStartingPort + appIndex);
      if (!portAvilable) appIndex++;
    }

    createReflow(appStartingPort + appIndex).start(window, {
      flow: app.flow,
      flowParams: app.params,
    }).then(() => {
      openApps = openApps.filter((app) => app.id !== newOpenApp.id)
      desktop.update({ openApps });
    });

    openApps.push(newOpenApp);
    desktop.update({ openApps });
  });

  await desktop;
});
