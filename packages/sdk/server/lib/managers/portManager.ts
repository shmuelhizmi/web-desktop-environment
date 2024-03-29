import Logger from "../utils/logger";
import getPort, { makeRange } from "get-port";
import DesktopManager from "../managers/desktopManager";
import API, { APIClient } from "@web-desktop-environment/server-api";
import { v4 as uuid } from "uuid";
import os from "os";
import dns from "dns";

export const timeout = (time: number) =>
	new Promise((resolve) => setTimeout(resolve, time));

export default class PortManager {
	private logger: Logger;
	private desktopManager: DesktopManager;
	constructor(parentLogger: Logger, desktopManger: DesktopManager) {
		this.logger = parentLogger.mount("port-manager");
		this.desktopManager = desktopManger;
		APIClient.portManager.getPort.override(
			() => () => this.getPort().then((port) => ({ port }))
		);
		APIClient.portManager.withDomain.override(() => () => this.withDomain());
	}

	public usedPorts: number[] = [];

	public getAvailablePorts = () => {
		const { endPort, startPort } =
			this.desktopManager.settingsManager.settings.network.ports;
		const result: number[] = [];
		for (const currentPort of makeRange(startPort, endPort)) {
			if (!this.usedPorts.includes(currentPort)) {
				result.push(currentPort);
			}
		}
		return result.sort(() => 0.5 - Math.random()); // shuffle
	};

	public getPort = async (isMainPort?: boolean): Promise<number> => {
		const { mainPort } =
			this.desktopManager.settingsManager.settings.network.ports;
		if (isMainPort) {
			return getPort({
				port: makeRange(mainPort, mainPort + 100),
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
	public getHost() {
		return new Promise<string>((resolve) => {
			dns.lookup(os.hostname(), (err, address) => {
				if (err) {
					resolve("127.0.0.1");
				}
				resolve(address);
			});
		});
	}
	public withDomain = async () => {
		const port = await this.getPort();
		const domain = uuid();
		await API.domainManager.registerDomain(domain, port);
		return { port, domain };
	};
}
