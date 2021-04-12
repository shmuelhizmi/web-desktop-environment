import { join } from "path";
import * as fs from "fs-extra";
import { homedir } from "os";
import { mergeDeep } from "@utils/mergeObjects";
import Emitter from "@utils/emitter";
import { Settings } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { PartialPartial } from "@web-desktop-environment/interfaces/lib/shared/types";
import Logger from "@utils/logger";
import { APIClient } from "@web-desktop-environment/server-api";

interface SettingsEvent {
	onNewSettings: Settings;
	init: Settings;
}

export const settingsFolder = ".web-desktop-environment-config";
export const settingsFile = "settings.json";

export default class SettingsManager {
	private logger: Logger;

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

	constructor(parentLogger: Logger, settingsOverride?: Partial<Settings>) {
		this.logger = parentLogger.mount("settings-manager");
		this.settingsOverride = settingsOverride;
	}

	public static defaultSettings: Settings = {
		desktop: {
			theme: "dark",
			background: "url(https://picsum.photos/id/1039/1920/1080)",
			nativeBackground: "https://picsum.photos/id/237/1080/1920",
		},
		network: {
			ports: {
				mainPort: 5000,
				startPort: 9200,
				endPort: 9400,
			},
		},
	};

	async initialize() {
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
		this.logger.info("finish initializing settings manager");
		this.emitter.call("init", this.settings);
		APIClient.settingsManager.getSetting.override(() => () => this.settings);
		APIClient.settingsManager.setSetting.override(() => (settings) =>
			this.setSettings(settings)
		);
		this.emitter.on("onNewSettings", (settings) =>
			APIClient.settingsManager.call("onNewSettings", settings)
		);
	}

	async setSettings(newSettings: PartialPartial<Settings>) {
		if (this.isInitialized) {
			mergeDeep<Settings>(this._settings, newSettings);
			this.emitter.call("onNewSettings", this.settings);
			// use sync to avoid tow setSettings call trying to write the file in the same time - TODO - replace
			fs.writeJSONSync(this.settingsFilePath, this._settings);
		} else {
			await new Promise((res) => this.emitter.on("init", res));
			this.setSettings(newSettings);
		}
	}
}
