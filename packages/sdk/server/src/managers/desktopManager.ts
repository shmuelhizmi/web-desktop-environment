import Logger from "@utils/logger";
import PortManager from "@managers/portManager";
import SettingsManager from "@managers/settingsManager";
import WindowManager from "@managers/windowsManager";
import DownloadManager from "@managers/downloadManager";
import { APIClient } from "@web-desktop-environment/server-api";
import uuid from "uuid";

export default class DesktopManager {
	public readonly name: string;

	private logger: Logger;

	public portManager: PortManager;
	public settingsManager: SettingsManager;
	public windowManager: WindowManager;
	public downloadManager: DownloadManager;
	constructor(name: string, rootLogger?: Logger) {
		this.name = name;

		const parentLogger = rootLogger || new Logger("root");
		this.logger = parentLogger.mount(name);

		this.portManager = new PortManager(this.logger, this);
		this.settingsManager = new SettingsManager(this.logger);
		this.windowManager = new WindowManager(this.logger, this);
		this.downloadManager = new DownloadManager(this.logger, this);
		implementLoggingManager(this.logger);
	}
}

export type defaultFlowInput = {
	desktopManager: DesktopManager;
	parentLogger: Logger;
};

const implementLoggingManager = (parentLogger: Logger) => {
	const logger = parentLogger.mount("api-provider");
	const tokenLoggerMap: { [token: string]: Logger } = {};
	APIClient.loggingManager.mount.override(
		() => (name: string, parentToken?: string) => {
			const newLogger = parentToken
				? tokenLoggerMap[parentToken].mount(name)
				: logger.mount(name);
			const mountToken = uuid();
			tokenLoggerMap[mountToken] = newLogger;
			return { mountToken };
		}
	);
	APIClient.loggingManager.info.override(
		() => (token: string, message: string) => {
			tokenLoggerMap[token].info(message);
		}
	);
	APIClient.loggingManager.warn.override(
		() => (token: string, message: string) => {
			tokenLoggerMap[token].warn(message);
		}
	);
	APIClient.loggingManager.error.override(
		() => (token: string, message: string) => {
			tokenLoggerMap[token].error(message);
		}
	);
};
