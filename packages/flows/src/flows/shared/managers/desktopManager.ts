import Logger from "@utils/logger";
import PortManager from "@managers/portManager";
import SettingsManager from "@managers/settingsManager";
import WindowManager from "@managers/windowsManager";

export default class DesktopManager {
	public readonly name: string;

	private logger: Logger;

	public portManager: PortManager;
	public settingsManager: SettingsManager;
	public windowManager: WindowManager;
	constructor(name: string, rootLoger?: Logger) {
		this.name = name;

		const parentLogger = rootLoger || new Logger("root");
		this.logger = parentLogger.mount(name);

		this.portManager = new PortManager(this.logger, this);
		this.settingsManager = new SettingsManager(this.logger);
		this.windowManager = new WindowManager(this.logger, this);
	}
}

export type defaultFlowInput = {
	desktopManager: DesktopManager;
	parentLogger: Logger;
};
