import React from "react";
import Emitter from "@utils/emitter";
import Logger from "@utils/logger";
import { OpenApp } from "@web-desktop-environment/interfaces/lib/views/Desktop";
import DesktopManager from "@managers/desktopManager";
import { webDesktopEnvironmentInternalCommiunicationAppRunnerBroadcast } from "@root/const";
import { BroadcastChannel } from "broadcast-channel";
import { APIClient } from "@web-desktop-environment/server-api";
import { AppRegistrationData } from "@web-desktop-environment/server-api/lib/backend/managers/apps/appsManager";
import uuid from "uuid";

export const ProcessIDProvider = React.createContext<undefined | number>(
	undefined
);

interface WindowManagerEvents {
	onAppLaunch: OpenApp;
	onAppsUpdate: OpenApp[];
}

export default class WindowManager {
	private logger: Logger;
	private desktopManager: DesktopManager;

	private _runningApps: (OpenApp & { cancel: () => void })[] = [];
	public get runningApps() {
		return this._runningApps;
	}

	public emitter = new Emitter<WindowManagerEvents>();

	private availableApps: { [name: string]: AppRegistrationData };

	constructor(parentLogger: Logger, desktopManager: DesktopManager) {
		this.logger = parentLogger.mount("windows-manager");
		this.desktopManager = desktopManager;
		this.listenToExternalAppLaunches();
		APIClient.appsManager.registerApp.override(() => (newApp) => {
			this.availableApps[newApp.name] = newApp;
		});
		APIClient.appsManager.launchApp.override(() => async (name, input) => ({
			processId: await this.spawnApp(name, input),
		}));
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
		const appData = this.availableApps[name];
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
		this.emitter.call("onAppsUpdate", this._runningApps);
		return processId;
	};

	killApp = (id: string) => {
		this._runningApps.find((app) => app.id === id).cancel();
		this._runningApps = this._runningApps.filter((app) => app.id !== id);
		this.emitter.call("onAppsUpdate", this._runningApps);
	};
}
