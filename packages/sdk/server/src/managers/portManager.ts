import Logger from "@utils/logger";
import getPort from "get-port";
import DesktopManager from "@managers/desktopManager";
import { APIClient } from "@web-desktop-environment/server-api";
import { createServer } from "http";
import ProxyServer, { createProxyServer } from "http-proxy";
import { IncomingMessage } from "http";

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

	public usedPorts: { [port: number]: { ws: boolean } } = [];

	public getAvailablePorts = () => {
		const {
			endPort,
			startPort,
		} = this.desktopManager.settingsManager.settings.network.ports;
		const result: number[] = [];
		for (const currentPort of getPort.makeRange(startPort, endPort)) {
			if (!this.usedPorts[currentPort]) {
				result.push(currentPort);
			}
		}
		return result.sort(() => 0.5 - Math.random()); // shuffle
	};

	public getPort = async (isMainPort?: boolean, ws = true): Promise<number> => {
		const {
			mainPort,
		} = this.desktopManager.settingsManager.settings.network.ports;
		if (isMainPort) {
			return getPort({
				port: getPort.makeRange(mainPort, mainPort + 100),
			}).then((value) => {
				this.logger.info(`port ${value} is available as main port`);
				return value;
			});
		} else {
			return getPort({
				port: this.getAvailablePorts(),
			}).then((value) => {
				this.usedPorts[value] = { ws };
				this.logger.info(`port ${value} is available as app port`);
				return value;
			});
		}
	};

	public async startBridge(desktopPort: number) {
		const mainPort = await this.getPort(/* isMainPort */ true);
		this.logger.info(`starting web-desktop-environment on port ${mainPort}`);
		const proxies: { [port: number]: ProxyServer } = {};
		const httpServer = createServer((req, res) => {
			const headers = req.headers as Record<string, string>;
			const location = req.url;
			if (location.startsWith("/desktop")) {
				req.url = req.url.replace("/desktop", "") || "/";
				let proxy: ProxyServer;
				if (proxies[desktopPort]) {
					proxy = proxies[desktopPort];
				} else {
					proxies[desktopPort] = createProxyServer({
						ws: true,
						target: `ws://localhost:${desktopPort}`,
						headers,
						changeOrigin: true,
					});
					proxy = proxies[desktopPort];
				}
				proxy.web(req, res, { headers });
			} else {
				const regexResult = /^\/app\/(?<port>[0-9]+)/.exec(req.url);
				if (regexResult?.length > 0) {
					const port = Number(regexResult.groups.port);
					if (this.usedPorts[port]) {
						const { ws } = this.usedPorts[port];
						req.url = req.url.replace(regexResult[0], "") || "/";
						let proxy: ProxyServer;
						if (proxies[port]) {
							proxy = proxies[port];
						} else {
							proxies[port] = createProxyServer({
								ws: true,
								target: `${ws ? "ws" : "http"}://localhost:${port}`,
								headers,
								changeOrigin: true,
							});
							proxy = proxies[port];
						}
						proxy.web(req, res, { headers });
					}
				}
			}
		});
		httpServer.on("upgrade", (req: IncomingMessage, socket, head) => {
			const location = req.url;
			if (location.startsWith("/desktop")) {
				req.url = req.url.replace("/desktop", "") || "/";
				let proxy: ProxyServer;
				req.headers.host = `localhost:${desktopPort}`;
				const headers = req.headers as Record<string, string>;
				if (proxies[desktopPort]) {
					proxy = proxies[desktopPort];
				} else {
					proxies[desktopPort] = createProxyServer({
						ws: true,
						target: `ws://localhost:${desktopPort}`,
						headers,
						changeOrigin: true,
					});
					proxy = proxies[desktopPort];
				}
				proxy.ws(req, socket, head, { headers });
			} else {
				const regexResult = /^\/app\/(?<port>[0-9]+)/.exec(req.url);
				if (regexResult?.length > 0) {
					const port = Number(regexResult.groups.port);
					req.url = req.url.replace(`/app/${port}`, "");
					req.headers.host = `localhost:${port}`;
					const headers = req.headers as Record<string, string>;
					if (proxies[port]) {
						proxies[port].ws(req, socket, head, { headers });
					} else {
						proxies[port] = createProxyServer({
							ws: true,
							target: `ws://localhost:${port}`,
							headers,
							changeOrigin: true,
						});
						proxies[port].ws(req, socket, head, { headers });
					}
				}
			}
		});
		httpServer.listen(mainPort);
	}
}
