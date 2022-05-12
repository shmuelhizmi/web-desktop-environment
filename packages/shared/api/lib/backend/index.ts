import APIBase from "./apiBase";
import appsManager from "./managers/apps/appsManager";
import serviceManager from "./managers/apps/serviceManager";
import loggingManager from "./managers/logging/loggingManager";
import settingsManager from "./managers/system/settings";
import x11Manager from "./managers/system/x11";
import downloadManager from "./managers/services/downloadManager";
import domainManager from "./managers/services/domainManager";
import portManager from "./managers/services/portManager";

class API extends APIBase {
  appsManager = this.registerManager(appsManager);
  settingsManager = this.registerManager(settingsManager);
  loggingManager = this.registerManager(loggingManager);
  downloadManager = this.registerManager(downloadManager);
  portManager = this.registerManager(portManager);
  domainManager = this.registerManager(domainManager);
  serviceManager = this.registerManager(serviceManager);
  x11Manager = this.registerManager(x11Manager);
}

export default new API();
