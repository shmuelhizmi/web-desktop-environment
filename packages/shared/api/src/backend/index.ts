import APIBase from "./apiBase";
import appsManager from "./managers/apps/appsManager";

class API extends APIBase {
	appsManager = this.registerManager(appsManager);
}

export default new API();
