import Logger from "../utils/logger";
import getPort from "get-port";
import DesktopManager from "../managers/desktopManager";
import { APIClient } from "@web-desktop-environment/server-api";
import * as https from "https";
import * as http from "http";
import httpProxy from "http-proxy";
import { v4 as uuid } from "uuid";
import { blueBright } from "chalk";
import { parse as parseCookies } from "cookie";

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
	}

	public usedPorts: Map<string, number> = new Map();

	public getAvailablePorts = () => {
		const { endPort, startPort } =
			this.desktopManager.settingsManager.settings.network.ports;
		const result: number[] = [];
		for (const currentPort of getPort.makeRange(startPort, endPort)) {
			if (!this.usedPorts.has(String(currentPort))) {
				result.push(currentPort);
			}
		}
		return result.sort(() => 0.5 - Math.random()); // shuffle
	};

	public getPort = async (
		isMainPort?: boolean,
		name?: string
	): Promise<number> => {
		const { mainPort } =
			this.desktopManager.settingsManager.settings.network.ports;
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
				this.usedPorts.set(String(value), value);
				if (name) {
					this.usedPorts.set(name, value);
				}
				this.logger.info(`port ${value} is avilable as app port`);
				return value;
			});
		}
	};

	public startProxyServer = async (useHttps = false) => {
		const port = await this.getPort(true);
		const password = uuid();
		this.logger.info(
			`starting proxy server on port ${port} -- this is the port you can use to acess to the server`
		);
		this.logger.info(`server password: ${blueBright(password)}`);
		const httpLib = useHttps ? https : http;

		const proxy = httpProxy.createProxyServer({
			ws: true,
		});
		function reqToTarget(headers: http.IncomingHttpHeaders) {
			const cookies = parseCookies(headers.cookie);
			const targetPortName = headers.port || cookies["port"];
			if (typeof targetPortName !== "string") {
				return "port not found";
			}
			const targetPort = this.usedPorts.get(targetPortName);
			if (!targetPort) {
				return "port not found";
			}
			const proxyAuth =
				headers["proxy-authorization"] || cookies["proxy-authorization"];
			if (proxyAuth !== password) {
				return "wrong password";
			}
			return targetPort;
		}
		const server = httpLib.createServer((req, res) => {
			const result = reqToTarget(req.headers);
			if (typeof result === "string") {
				res.writeHead(404).write(result);
			} else {
				proxy.web(req, res, {
					target: "http://localhost:" + result,
				});
			}
		});
		server.on("upgrade", (req, socket, head) => {
			const result = reqToTarget(req.headers);
			if (typeof result === "string") {
				socket.end(result);
			} else {
				proxy.ws(req, socket, head, {
					target: "http://localhost:" + result,
				});
			}
		});
		server.listen(port);
	};
}
