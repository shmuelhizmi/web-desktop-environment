import Emitter from "../utils/emitter";
import Logger from "../utils/logger";
import {
	App,
	OpenApp,
} from "@web-desktop-environment/interfaces/lib/views/Desktop";
import DesktopManager from "../managers/desktopManager";
import {
	Request,
	webDesktopEnvironmentInternalCommunicationBroadcast,
} from "../const";
import { BroadcastChannel } from "broadcast-channel";
import { APIClient, API } from "@web-desktop-environment/server-api";
import { AppRegistrationData } from "@web-desktop-environment/server-api/lib/backend/managers/apps/appsManager";
import { v4 as uuid } from "uuid";
import cp from "child_process";
import { x11Utils } from "@web-desktop-environment/app-sdk";
import { Icon } from "@web-desktop-environment/interfaces/lib/shared/icon";

interface AppsManagerEvents {
	onAppLaunch: OpenApp;
	onOpenAppsUpdate: OpenApp[];
	onInstalledAppsUpdate: App[];
	onServiceAppLaunch: { port: number; domain: string };
}

export default class AppsManager extends Emitter<AppsManagerEvents> {
	private logger: Logger;
	private desktopManager: DesktopManager;

	private _runningApps: (OpenApp & { cancel: () => void })[] = [];
	public get runningApps() {
		return this._runningApps;
	}
	private _servicesApps: { port: number; domain: string }[] = [];
	public get servicesApps() {
		return this._servicesApps;
	}

	private availableApps = new Map<string, AppRegistrationData>();
	private availableExternalApps = new Map<string, AppRegistrationData>();

	public get apps() {
		return Array.from(this.availableApps.entries())
			.concat(Array.from(this.availableExternalApps.entries()))
			.map(
				([name, app]) =>
					({
						appName: name,
						description: app.description,
						displayName: app.displayName,
						icon: app.icon,
					} as App)
			);
	}

	constructor(parentLogger: Logger, desktopManager: DesktopManager) {
		super();
		this.logger = parentLogger.mount("windows-manager");
		this.desktopManager = desktopManager;
		this.listenToExternalAppLaunches();
		APIClient.appsManager.registerApp.override(() => (newApp) => {
			this.availableApps.set(newApp.name, newApp);
			this.call("onInstalledAppsUpdate", this.apps);
		});
		APIClient.appsManager.launchApp.override(() => async (name, input) => ({
			processId: await this.spawnApp(name, input),
		}));
		APIClient.appsManager.closeApp.override(() => async (processId) => {
			this.killApp(processId);
		});
		APIClient.serviceManager.requestUIPort.override(() => this.requestUIPort);
	}

	async readx11Apps() {
		const x11Apps = await x11Utils.getAllX11Apps();
		for (const app of x11Apps) {
			let icon: Icon = {
				type: "icon",
				icon: "FcLinux",
			};
			if (app.iconAsImgUri) {
				icon = {
					type: "img",
					icon: app.iconAsImgUri,
				};
			}
			this.availableExternalApps.set(app.exec, {
				description: app.description,
				displayName: app.name,
				icon,
				name: app.name,
				id: app.exec,
			});
		}
		this.call("onInstalledAppsUpdate", this.apps);
	}

	requestUIPort = async () => {
		const { domain, port } = await this.desktopManager.portManager.withDomain();
		this._servicesApps.push({ domain, port });
		this.call("onServiceAppLaunch", { domain, port });
		return port;
	};

	listenToExternalAppLaunches = () => {
		const channel = new BroadcastChannel<Request>(
			webDesktopEnvironmentInternalCommunicationBroadcast
		);
		channel.addEventListener("message", (message) => {
			if (message.type === "launch") {
				this.spawnApp(message.name, message.input);
			}
			if (message.type === "getApps") {
				channel.postMessage({
					type: "getAppsResponse",
					// TODO: app input is currently defined using typescript types, but it should be defined using json schema
					apps: this.apps
						.map((app) => ({ name: app.appName, input: {} }))
						.reduce((acc, app) => {
							acc[app.name] = app.input;
							return acc;
						}, {} as Record<string, Record<string, unknown>>),
				});
			}
		});
	};

	spawnApp = async (name: string, input: Record<string, unknown>) => {
		const processId = uuid();
		const appData = this.availableApps.get(name);
		if (appData) {
			const port = await this.desktopManager.portManager.getPort();
			APIClient.appsManager.call("launchApp", {
				appId: appData.id,
				options: input,
				port,
				processId,
			});
			API.domainManager.registerDomain(`app-${processId}`, port);
			const openApp = {
				icon: appData.icon,
				id: processId,
				name: appData.name,
				port,
				cancel: () => {
					APIClient.appsManager.call("closeApp", { processId });
				},
			};
			this.call("onAppLaunch", openApp);
			this._runningApps.push(openApp);
			this.call("onOpenAppsUpdate", this._runningApps);
			return processId;
		} else {
			await this.tryToExecuteApp(name, input);
		}
	};

	tryToExecuteApp = async (name: string, _input: Record<string, unknown>) => {
		const app = this.availableExternalApps.get(name);
		if (app) {
			const cprocess = cp.exec(name, {
				env: {
					...process.env,
					DISPLAY: ":" + (await API.x11Manager.getActiveDisplay()),
				},
				cwd: process.cwd(),
			});
			cprocess.on("error", (err) => {
				this.logger.error(err.message);
			});
		}
	};

	killApp = (processId: string) => {
		this._runningApps.find((app) => app.id === processId).cancel();
		this._runningApps = this._runningApps.filter((app) => app.id !== processId);
		this.call("onOpenAppsUpdate", this._runningApps);
		APIClient.appsManager.call("closeApp", { processId });
	};
}
