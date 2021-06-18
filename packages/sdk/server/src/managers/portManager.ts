import Logger from "@utils/logger";
import getPort from "get-port";
import DesktopManager from "@managers/desktopManager";
import { APIClient } from "@web-desktop-environment/server-api";
import { createServer } from "http";
import ProxyServer, { createProxyServer } from "http-proxy";
import { IncomingMessage } from "http";
import * as net from "net";

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

	public waitForPort(port: number, timeoutCount = 0): Promise<void> {
		return new Promise<void>((res, rej) => {
			const connection = net.createConnection({ port, host: "localhost" });
			connection.on("error", () => {
				if (timeoutCount > 10) {
					rej();
					return;
				}
				setTimeout(() => {
					this.waitForPort(port, timeoutCount + 1)
						.then(res)
						.then(() => connection.destroy());
				}, 10);
			});
			connection.on("connect", () => {
				connection.destroy();
				res();
			});
		});
	}

	public async startBridge(desktopPort: number) {
		const mainPort = await this.getPort(/* isMainPort */ true);
		this.logger.info(`starting web-desktop-environment on port ${mainPort}`);
		const proxies: { [port: number]: ProxyServer } = {};
		const httpServer = createServer(async (req, res) => {
			try {
				const headers = req.headers as Record<string, string>;
				const location = req.url;
				if (location === "/login") {
					return this.desktopManager.authManager.authLogin(req, res);
				}
				if (location.startsWith("/desktop")) {
					const [, , token] = req.url.split("/");
					if (!token || !this.desktopManager.authManager.authReq(token)) {
						res.writeHead(500, "invalid token");
						res.end();
						return;
					}
					await this.waitForPort(desktopPort);
					req.url = req.url.replace(`/desktop/${token}/`, "/") || "/";
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
					proxy.web(req, res, { headers }, (err) => {
						this.logger.error(
							`fail to forward http request to ${desktopPort} - ${err.message}`
						);
					});
				} else if (location.startsWith("/app/")) {
					const [, app, _port, token] = location.split("/");
					if (
						!app ||
						!_port ||
						!token ||
						!this.desktopManager.authManager.authReq(token)
					) {
						res.writeHead(500, "invalid token");
						res.end();
						return;
					}
					req.url = req.url.replace(`/app/${_port}/${token}/`, "/") || "/";
					const port = Number(_port);
					await this.waitForPort(port);
					if (this.usedPorts[port]) {
						const { ws } = this.usedPorts[port];
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
						proxy.web(req, res, { headers }, (err) => {
							this.logger.error(
								`fail to forward http request to ${port} - ${err.message}`
							);
						});
					}
				}
			} catch (err) {
				/* */
			}
		});
		httpServer.on("upgrade", async (req: IncomingMessage, socket, head) => {
			try {
				const location = req.url;
				if (location.startsWith("/desktop")) {
					const [, , token] = req.url.split("/");
					if (!token || !this.desktopManager.authManager.authReq(token)) {
						return;
					}
					await this.waitForPort(desktopPort);
					req.url = req.url.replace(`/desktop/${token}/`, "/") || "/";
					req.headers.host = `localhost:${desktopPort}`;
					req.headers.origin = `localhost:${desktopPort}`;
					let proxy: ProxyServer;
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
					proxy.ws(req, socket, head, { headers }, (err) => {
						this.logger.error(
							`fail to forward ws request to ${desktopPort} - ${err.message}`
						);
					});
				} else {
					const [, app, _port, token] = location.split("/");
					if (
						!app ||
						!_port ||
						!token ||
						!this.desktopManager.authManager.authReq(token)
					) {
						return;
					}
					req.url = req.url.replace(`/app/${_port}/${token}/`, "/") || "/";
					const port = Number(_port);
					await this.waitForPort(port);
					req.headers.host = `localhost:${port}`;
					req.headers.origin = `localhost:${port}`;
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
					}
					proxies[port].ws(req, socket, head, { headers }, (err) => {
						this.logger.error(
							`fail to forward ws request to ${port} - ${err.message}`
						);
					});
				}
			} catch (err) {
				/* */
			}
		});
		httpServer.listen(mainPort);
	}
}
