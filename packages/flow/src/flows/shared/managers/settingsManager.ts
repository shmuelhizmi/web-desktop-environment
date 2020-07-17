import { join } from "path";
import * as fs from "fs-extra";
import { homedir } from "os";
import { mergeDeep } from "../utils/mergeObjects";
import Emitter from "../utils/emitter";
import { Settings } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { PartialPartial } from "@web-desktop-environment/interfaces/lib/shared/types";
import waitFor from "../utils/waitFor";

interface SettingsEvent {
  onNewSettings: Settings;
  init: Settings;
}

export const settingsFolder = ".web-desktop-environment-config";
export const settingsFile = "settings.json";

export default class SettingsManager {
  public settingsFolderPath = join(homedir(), settingsFolder);
  public settingsFilePath = join(this.settingsFolderPath, settingsFile);

  private _settings: Settings;
  private settingsOverride: Partial<Settings>;

  public get settings() {
    return { ...this._settings, ...this.settingsOverride };
  }

  private _isInitialized = false;
  public get isInitialized() {
    return this._isInitialized;
  }

  public emitter = new Emitter<SettingsEvent>();

  constructor(settingsOverride?: Partial<Settings>) {
    this.settingsOverride = settingsOverride;
  }

  public static defaultSettings: Settings = {
    desktop: {
      theme: "transparent",
      background: "url(https://picsum.photos/1920/1080)",
    },
    network: {
      ports: {
        mainPort: 5000,
        startPort: 9200,
        endPort: 9200,
      },
    },
  };

  async initalize() {
    const folderExist = await fs.pathExists(this.settingsFolderPath);
    const fileExist = await fs.pathExists(this.settingsFilePath);
    if (folderExist && fileExist) {
      const settings: Settings = { ...SettingsManager.defaultSettings };
      mergeDeep(settings, await fs.readJson(this.settingsFilePath));
      this._settings = settings;
      await fs.writeJSON(this.settingsFilePath, settings);
    } else {
      if (!folderExist) {
        await fs.mkdir(this.settingsFolderPath);
      }
      await fs.writeJSON(
        this.settingsFilePath,
        SettingsManager.defaultSettings
      );
      this._settings = SettingsManager.defaultSettings;
    }
    this._isInitialized = true;
    this.emitter.call("init", this.settings);
  }

  private isUpdatingSettings = false;
  async setSettings(newSettings: PartialPartial<Settings>) {
    if (this.isInitialized) {
      if (this.isUpdatingSettings) {
        await waitFor(() => !this.isUpdatingSettings, 25 * Math.random());
      }
      this.isUpdatingSettings = true;
      mergeDeep<Settings>(this._settings, newSettings);
      this.emitter.call("onNewSettings", this.settings);
      await fs.writeJSON(this.settingsFilePath, this._settings);
      this.isUpdatingSettings = false;
    } else {
      throw new Error(
        "please update settings only after initilazing settings manager"
      );
    }
  }
}
