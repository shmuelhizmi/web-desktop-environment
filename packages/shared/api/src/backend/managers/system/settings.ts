import { Settings } from "@web-desktop-environment/interfaces/lib/shared/settings";
import ManagerBase from "../../managerBase";

interface SettingsManagerEvents {
  onNewSettings: Settings;
}

export class SettingsManager extends ManagerBase<SettingsManagerEvents> {
  name = "settings";
  getSetting = this.registerFunction<() => Settings>("getSetting");
}

export default new SettingsManager();
