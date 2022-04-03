import Logger from "../utils/logger";
import PortManager from "../managers/portManager";
import SettingsManager from "../managers/settingsManager";
import AppsManager from "../managers/appsManager";
import DownloadManager from "../managers/downloadManager";
import { APIClient } from "@web-desktop-environment/server-api";
import uuid from "uuid";
import PackageManager from "../managers/packageManager";
import DomainManager from "../managers/domainManager";
import AuthManager from "../managers/authManager";
import { API } from "@web-desktop-environment/server-api";
import { PackageJSON } from "@web-desktop-environment/interfaces/lib/shared/package";
export default class DesktopManager {
	public readonly name: string;

	private logger: Logger;

	public portManager: PortManager;
	public settingsManager: SettingsManager;
	public appsManager: AppsManager;
	public downloadManager: DownloadManager;
	public packageManager: PackageManager;
	public domainManager: DomainManager;
	public authManager: AuthManager;
	constructor(name: string, rootLogger?: Logger) {
		this.name = name;

		const parentLogger = rootLogger || new Logger("root");
		this.logger = parentLogger.mount(name);

		this.portManager = new PortManager(this.logger, this);
		this.settingsManager = new SettingsManager(this.logger);
		this.appsManager = new AppsManager(this.logger, this);
		this.downloadManager = new DownloadManager(this.logger, this);
		this.packageManager = new PackageManager(this.logger);
		this.domainManager = new DomainManager(this.logger, this);
		this.authManager = new AuthManager(this.logger, this);
		implementLoggingManager(this.logger);
	}
	public async initialize(packageJSON: PackageJSON) {
		await this.settingsManager.initialize();
		await this.downloadManager.initialize();
		const mainPort = await this.portManager.getPort(true);
		await this.domainManager.startSubDomainServer(mainPort);
		this.logger.info(`starting web-desktop-environment on port ${mainPort}`);
		const desktopPort = await this.portManager.getPort(false);
		this.logger.info(`starting desktop on port ${desktopPort}`);
		API.domainManager.registerDomain("desktop", desktopPort);
		await this.packageManager.searchForNewPackages(
			packageJSON.apps,
			/* run */ true
		);
		return {
			desktopPort,
		};
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
