import { Settings } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { PartialPartial } from "@web-desktop-environment/interfaces/lib/shared/types";
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

  setSettings(settings: PartialPartial<Settings>) {
    return API.settingsManager.setSetting.execute(settings);
  }
}

export default new SettingsManager();
