import Logger from "@utils/logger";
import * as getPort from "get-port";
import DesktopManager from "@managers/desktopManager";

export const timeout = (time: number) =>
	new Promise((resolve) => setTimeout(resolve, time));

export default class PortManager {
	private logger: Logger;
	private desktopManager: DesktopManager;
	constructor(parentLogger: Logger, desktopManger: DesktopManager) {
		this.logger = parentLogger.mount("port-manager");
		this.desktopManager = desktopManger;
	}
	public getPort = async (isMainPort?: boolean): Promise<number> => {
		const {
			endPort,
			mainPort,
			startPort,
		} = this.desktopManager.settingsManager.settings.network.ports;
		if (isMainPort) {
			return getPort({
				port: getPort.makeRange(mainPort, mainPort + 100),
			}).then((value) => {
				this.logger.info(`port ${value} is avilable as main port`);
				return value;
			});
		} else {
			return getPort({
				port: getPort.makeRange(startPort, endPort),
			}).then((value) => {
				this.logger.info(`port ${value} is avilable as app port`);
				return value;
			});
		}
	};
}
