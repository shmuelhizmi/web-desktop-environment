import APIBase from "./apiBase";
import appsManager from "./managers/apps/appsManager";
import loggingManager from "./managers/logging/loggingManager";
import settingsManager from "./managers/system/settings";

class API extends APIBase {
	appsManager = this.registerManager(appsManager);
	settingsManager = this.registerManager(settingsManager);
	loggingManager = this.registerManager(loggingManager);
}

export default new API();
