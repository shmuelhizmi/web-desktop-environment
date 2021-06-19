import Logger from "@utils/logger";
import getPort from "get-port";
import DesktopManager from "@managers/desktopManager";
import { APIClient } from "@web-desktop-environment/server-api";
import express, { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import * as net from "net";
import cors from "cors";

export const timeout = (time: number) =>
	new Promise((resolve) => setTimeout(resolve, time));

export default class PortManager {
	private logger: Logger;
	private desktopManager: DesktopManager;
	private expressApp: Express;
	constructor(parentLogger: Logger, desktopManger: DesktopManager) {
		this.logger = parentLogger.mount("port-manager");
		this.desktopManager = desktopManger;
		APIClient.portManager.getPort.override(() => () =>
			this.getPort().then((port) => ({ port }))
		);
		this.expressApp = express();
	}

	public registerAppPort = (port: number) => {
		const proxy = createProxyMiddleware({
			changeOrigin: true,
			target: `http://localhost:${port}`,
			ws: true,
			pathRewrite: {
				"\\/app\\/([0-9])+\\/([a-zA-Z_\\.0-9\\-])+\\/": "/",
			},
			// logLevel: "error",
		});
		this.expressApp.use(
			`/app/${port}/:token`,
			async (req, res, next) => {
				req.setMaxListeners(0);
				const { token } = req.params;
				const isAuthOk = this.desktopManager.authManager.authReq(token);
				if (isAuthOk) {
					await this.waitForPort(port);
					next();
				} else {
					res.status(500).send("invalid token");
				}
			},
			proxy
		);
	};
	public usedPorts = new Set<number>();

	public getAvailablePorts = () => {
		const {
			endPort,
			startPort,
		} = this.desktopManager.settingsManager.settings.network.ports;
		const result: number[] = [];
		for (const currentPort of getPort.makeRange(startPort, endPort)) {
			if (!this.usedPorts.has(currentPort)) {
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
				this.logger.info(`port ${value} is available as main port`);
				return value;
			});
		} else {
			return getPort({
				port: this.getAvailablePorts(),
			}).then((value) => {
				this.usedPorts.add(value);
				this.registerAppPort(value);
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
		const app = this.expressApp;
		app.use(express.json());
		app.use(cors());
		app.post("/login", this.desktopManager.authManager.authLogin);
		app.use(
			"/desktop/:token",
			async (req, res, next) => {
				req.setMaxListeners(0);
				const { token } = req.params;
				const isAuthOk = this.desktopManager.authManager.authReq(token);
				if (isAuthOk) {
					await this.waitForPort(mainPort);
					// req.url = req.url.replace(`/desktop/${token}`, "") || "/";
					next();
				} else {
					res.status(500).send("invalid token");
				}
			},
			createProxyMiddleware({
				changeOrigin: true,
				target: `http://localhost:${desktopPort}`,
				pathRewrite: {
					"\\/desktop\\/([a-zA-Z_\\.0-9\\-])+\\/": "/",
				},
				ws: true,
				logLevel: "error",
			})
		);
		app.setMaxListeners(0);
		app.listen(mainPort, "0.0.0.0", () => {
			this.logger.info(
				`successfully started web-desktop-environment on port ${mainPort}`
			);
		});
	}
}
