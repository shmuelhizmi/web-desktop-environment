import APIBase from "./apiBase";
import appsManager from "./managers/apps/appsManager";
import loggingManager from "./managers/logging/loggingManager";
import settingsManager from "./managers/system/settings";
import downloadManager from "./managers/services/downloadManager";
import portManager from "./managers/services/portManager";
import packageManager from "./managers/packages/packageManager";

class API extends APIBase {
  appsManager = this.registerManager(appsManager);
  settingsManager = this.registerManager(settingsManager);
  loggingManager = this.registerManager(loggingManager);
  downloadManager = this.registerManager(downloadManager);
  portManager = this.registerManager(portManager);
  packageManager = this.registerManager(packageManager);
}

export default new API();
