import React from "react";
import { Server } from "@react-fullstack/fullstack-socket-server";
import { Render } from "@react-fullstack/render";
import Emitter from "@utils/emitter";
import { AppsManager } from "@apps/index";
import Logger from "@utils/logger";
import { OpenApp } from "@web-desktop-environment/interfaces/lib/views/Desktop";
import DesktopManager from "@managers/desktopManager";
import { viewInterfaces } from "@web-desktop-environment/interfaces/lib";
import Window from "@components/desktop/Window";
import { AppProvider } from "@root/contexts";
import { webDesktopEnvironmentInternalCommiunicationAppRunnerBroadcast } from "@root/const";
import { BroadcastChannel } from "broadcast-channel";

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
	private newAppId = 0;

	public emitter = new Emitter<WindowManagerEvents>();

	constructor(parentLogger: Logger, desktopManager: DesktopManager) {
		this.logger = parentLogger.mount("windows-manager");
		this.desktopManager = desktopManager;
		this.listenToExternalAppLaunches();
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
		const handler = AppsManager.apps.get(name);
		const port = await this.desktopManager.portManager.getPort();
		const id = this.newAppId;
		this.newAppId++;
		const process = Render(
			<Server port={port} singleInstance views={viewInterfaces}>
				{() => (
					<AppProvider.Provider
						value={{ desktopManager: this.desktopManager, logger: this.logger }}
					>
						<ProcessIDProvider.Provider value={id}>
							<Window app={handler} appParams={input} />
						</ProcessIDProvider.Provider>
					</AppProvider.Provider>
				)}
			</Server>
		);
		const openApp = {
			icon: handler.icon,
			nativeIcon: handler.nativeIcon,
			id,
			name: handler.name,
			port,
			cancel: () => {
				process.stop();
				this._runningApps = this._runningApps.filter((app) => app.id !== id);
				this.emitter.call("onAppsUpdate", this._runningApps);
			},
		};
		this.emitter.call("onAppLaunch", openApp);
		this._runningApps.push(openApp);
		this.emitter.call("onAppsUpdate", this._runningApps);
	};

	killApp = (id: number) => {
		this._runningApps.find((app) => app.id === id).cancel();
		this._runningApps = this._runningApps.filter((app) => app.id !== id);
		this.emitter.call("onAppsUpdate", this._runningApps);
	};
}
