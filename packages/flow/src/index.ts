import { Reflow, Transports } from "@mcesystems/reflow";
import {
  ViewInterfacesType,
  viewInterfaces,
} from "@web-desktop-environment/interfaces/lib";
import desktop from "./flows/desktop";
import themeProvider from "./flows/container/themeProvider";
import PortManager from "./flows/shared/managers/portManager";
import SettingsManager from "./flows/shared/managers/settingsManager";
import WindowManager from "./flows/shared/managers/windowsManager";
import Logger from "./flows/shared/utils/logger";

export const createReflow = (port: number) =>
  new Reflow<ViewInterfacesType>({
    transport: new Transports.WebSocketsTransport({ port }),
    views: viewInterfaces,
  });

export const settingManager = new SettingsManager();

export const portManager = new PortManager();

export const rootLogger = new Logger("root");

export const windowManager = new WindowManager(rootLogger);

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
