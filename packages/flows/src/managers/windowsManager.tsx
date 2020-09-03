import React from "react";
import { Server } from "@react-fullstack/fullstack-socket-server";
import { Render } from "@react-fullstack/render";
import Emitter from "@utils/emitter";
import * as apps from "@apps/index";
import Logger from "@utils/logger";
import { OpenApp } from "@web-desktop-environment/interfaces/lib/views/Desktop";
import DesktopManager from "@managers/desktopManager";
import { viewInterfaces } from "@web-desktop-environment/interfaces/lib";
import { AppProvider } from "@index";
import Window from "@components/desktop/window";

export const ProccessIDProvider = React.createContext<undefined | number>(undefined);

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
	}

	spawnApp = async (name: string, input: Record<string, unknown>) => {
		const handler = apps[name];
		const port = await this.desktopManager.portManager.getPort();
		const id = this.newAppId;
		this.newAppId++;
		const process = Render(
			<Server port={port} singleInstance views={viewInterfaces}>
				{() => (
					<AppProvider.Provider
						value={{ desktopManager: this.desktopManager, logger: this.logger }}
					>
						<ProccessIDProvider.Provider value={id}>
							<Window app={handler} appParams={input} />
						</ProccessIDProvider.Provider>
						<handler.App {...input} />
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
