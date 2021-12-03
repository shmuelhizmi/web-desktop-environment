import Emitter from "../utils/emitter";
import Logger from "../utils/logger";
import {
	App,
	OpenApp,
} from "@web-desktop-environment/interfaces/lib/views/Desktop";
import DesktopManager from "../managers/desktopManager";
import { webDesktopEnvironmentInternalCommiunicationAppRunnerBroadcast } from "../const";
import { BroadcastChannel } from "broadcast-channel";
import { APIClient } from "@web-desktop-environment/server-api";
import { AppRegistrationData } from "@web-desktop-environment/server-api/lib/backend/managers/apps/appsManager";
import uuid from "uuid";

interface AppsManagerEvents {
	onAppLaunch: OpenApp;
	onOpenAppsUpdate: OpenApp[];
	onInstalledAppsUpdate: App[];
}

export default class AppsManager {
	private logger: Logger;
	private desktopManager: DesktopManager;

	private _runningApps: (OpenApp & { cancel: () => void })[] = [];
	public get runningApps() {
		return this._runningApps;
	}

	public emitter = new Emitter<AppsManagerEvents>();

	private availableApps = new Map<string, AppRegistrationData>();

	public get apps() {
		return Array.from(this.availableApps.entries()).map(
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
		this.logger = parentLogger.mount("windows-manager");
		this.desktopManager = desktopManager;
		this.listenToExternalAppLaunches();
		APIClient.appsManager.registerApp.override(() => (newApp) => {
			this.availableApps.set(newApp.name, newApp);
			this.emitter.call("onInstalledAppsUpdate", this.apps);
		});
		APIClient.appsManager.launchApp.override(() => async (name, input) => ({
			processId: await this.spawnApp(name, input),
		}));
		APIClient.appsManager.closeApp.override(() => async (processId) => {
			this.killApp(processId);
		});
	}

	listenToExternalAppLaunches = () => {
		const channel = new BroadcastChannel(
			webDesktopEnvironmentInternalCommiunicationAppRunnerBroadcast
		);
		channel.onmessage = ({
			name,
			input,
		}: {
			name: string;
			input: Record<string, unknown>;
		}) => {
			if (typeof name === "string" && typeof input === "object") {
				this.spawnApp(name, input);
			}
		};
	};

	spawnApp = async (name: string, input: Record<string, unknown>) => {
		const processId = uuid();
		const appData = this.availableApps.get(name);
		const port = await this.desktopManager.portManager.getPort();
		APIClient.appsManager.call("launchApp", {
			appId: appData.id,
			options: input,
			port,
			processId,
		});
		const openApp = {
			icon: appData.icon,
			id: processId,
			name: appData.name,
			port,
			cancel: () => {
				APIClient.appsManager.call("closeApp", { processId });
			},
		};
		this.emitter.call("onAppLaunch", openApp);
		this._runningApps.push(openApp);
		this.emitter.call("onOpenAppsUpdate", this._runningApps);
		return processId;
	};

	killApp = (processId: string) => {
		this._runningApps.find((app) => app.id === processId).cancel();
		this._runningApps = this._runningApps.filter((app) => app.id !== processId);
		this.emitter.call("onOpenAppsUpdate", this._runningApps);
		APIClient.appsManager.call("closeApp", { processId });
	};
}
