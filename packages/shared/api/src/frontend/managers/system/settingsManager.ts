import { Settings } from "@web-desktop-environment/interfaces/lib/shared/settings";
import API from "../../../backend/index";

export class SettingsManager {
  onNewSettings(listener: (newSettings: Settings) => void) {
    return {
      remove: API.settingsManager.on("onNewSettings", listener).remove,
    };
  }
  getSettings() {
    return API.settingsManager.getSetting.execute();
  }
}

export default new SettingsManager();
