import Logger from "@utils/logger";
import getPort from "get-port";
import DesktopManager from "@managers/desktopManager";
import { APIClient } from "@web-desktop-environment/server-api";

export const timeout = (time: number) =>
	new Promise((resolve) => setTimeout(resolve, time));

export default class PortManager {
	private logger: Logger;
	private desktopManager: DesktopManager;
	constructor(parentLogger: Logger, desktopManger: DesktopManager) {
		this.logger = parentLogger.mount("port-manager");
		this.desktopManager = desktopManger;
		APIClient.portManager.getPort.override(() => () =>
			this.getPort().then((port) => ({ port }))
		);
	}

	public usedPorts: number[] = [];

	public getAvailablePorts = () => {
		const {
			endPort,
			startPort,
		} = this.desktopManager.settingsManager.settings.network.ports;
		const result: number[] = [];
		for (const currentPort of getPort.makeRange(startPort, endPort)) {
			if (!this.usedPorts.includes(currentPort)) {
				result.push(currentPort);
			}
		}
		return result.sort(() => 0.5 - Math.random()); // shuffle
	};

	public getPort = async (isMainPort?: boolean): Promise<number> => {
		const {
			mainPort,
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
				port: this.getAvailablePorts(),
			}).then((value) => {
				this.usedPorts.push(value);
				this.logger.info(`port ${value} is avilable as app port`);
				return value;
			});
		}
	};
}
