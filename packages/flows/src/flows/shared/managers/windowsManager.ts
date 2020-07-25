import Emitter from "@utils/emitter";
import * as apps from "@apps/index";
import { createReflow } from "@index";
import Logger from "@utils/logger";
import { OpenApp } from "@web-desktop-environment/interfaces/lib/views/Desktop";
import window from "@desktop/window";
import DesktopManager from "@managers/desktopManager";

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

	spawnApp = async (flow: string, input: Record<string, unknown>) => {
		const handler = apps[flow];
		const port = await this.desktopManager.portManager.getPort();
		const id = this.newAppId;
		this.newAppId++;
		const process = createReflow(
			port,
			this.desktopManager.settingsManager.settings.desktop.theme
		);

		process
			.start(window, {
				desktopManager: this.desktopManager,
				parentLogger: this.logger,
				app: handler,
				appParams: input,
			})
			.then(() => {
				this._runningApps = this._runningApps.filter((app) => app.id !== id);
				this.emitter.call("onAppsUpdate", this._runningApps);
			})
			.catch(() => {
				this._runningApps = this._runningApps.filter((app) => app.id !== id);
				this.emitter.call("onAppsUpdate", this._runningApps);
			});
		const openApp = {
			icon: handler.icon,
			nativeIcon: handler.nativeIcon,
			id,
			name: handler.name,
			port,
			cancel: () => process.cancel(),
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
