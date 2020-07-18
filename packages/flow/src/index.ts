import { Reflow, Transports } from "@mcesystems/reflow";
import {
  ViewInterfacesType,
  viewInterfaces,
} from "@web-desktop-environment/interfaces/lib";
import desktop from "@desktop/index";
import themeProvider from "@container/themeProvider";
import PortManager from "@managers/portManager";
import SettingsManager from "@managers/settingsManager";
import WindowManager from "@managers/windowsManager";
import Logger from "@utils/logger";

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
