import appsManager from "./managers/apps/appsManager";
import serviceManager from "./managers/apps/serviceManager";
import settingsManager from "./managers/system/settingsManager";
import loggingManager from "./managers/logging/loggingManager";
import downloadManager from "./managers/services/downloadManager";
import portManager from "./managers/services/portManager";
import domainManager from "./managers/services/domainManager";
import x11Manager from "./managers/system/x11";

export default {
  appsManager,
  serviceManager,
  settingsManager,
  loggingManager,
  downloadManager,
  portManager,
  domainManager,
  x11Manager,
};
