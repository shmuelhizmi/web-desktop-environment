import { Settings } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { PartialPartial } from "@web-desktop-environment/interfaces/lib/shared/types";
import ManagerBase from "../../managerBase";

interface SettingsManagerEvents {
  onNewSettings: Settings;
}

export class SettingsManager extends ManagerBase<SettingsManagerEvents> {
  name = "settings";
  getSetting = this.registerFunction<() => Settings>("getSetting");
  setSetting = this.registerFunction<(settings: PartialPartial<Settings>) => void>("setSetting");
}

export default new SettingsManager();
