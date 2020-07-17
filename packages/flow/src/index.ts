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

export const rootLogger = new Logger("root");

export const settingManager = new SettingsManager(rootLogger);

export const portManager = new PortManager(rootLogger);

export const windowManager = new WindowManager(rootLogger);

settingManager.initalize().then(() => {
  portManager
    .getPort(true)
    .then((port) => {
      const reflow = createReflow(port);
      rootLogger.info(`starting webOS on port ${port}`);
      reflow.start(themeProvider, { childFlow: desktop }).then(() => {
        rootLogger.warn("app exist");
      });
    })
    .catch((e) => rootLogger.error((e && e.message) || e));
});
