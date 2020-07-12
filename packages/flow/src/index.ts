import { Reflow, Transports } from "@mcesystems/reflow";
import {
  ViewInterfacesType,
  viewInterfaces,
} from "@web-desktop-environment/interfaces/lib";
import desktop from "./flows/desktop";
import themeProvider from "./flows/container/themeProvider";
import PortManager from "./flows/shared/utils/portManager";
import SettingsManager from "./flows/shared/utils/settingsManager";

export const createReflow = (port: number) =>
  new Reflow<ViewInterfacesType>({
    transport: new Transports.WebSocketsTransport({ port }),
    views: viewInterfaces,
  });

export const settingManager = new SettingsManager();

export const portManager = new PortManager();

settingManager.initalize().then(() => {
  portManager
    .getPort(settingManager.settings.network.ports.mainPort)
    .then((port) => {
      const reflow = createReflow(port);
      console.log(`starting webOS on port ${port}`);
      reflow.start(themeProvider, { childFlow: desktop }).then(() => {
        console.log("app exist");
      });
    });
});
