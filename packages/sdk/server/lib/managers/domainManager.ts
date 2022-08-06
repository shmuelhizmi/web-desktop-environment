import Logger from "../utils/logger";
import DesktopManager from "../managers/desktopManager";
import { APIClient } from "@web-desktop-environment/server-api";
import http from "http";
import proxy from "http-proxy";
import liveServer from "live-server";
import path from "path";

const readReq = async (req: http.IncomingMessage) => {
	const buffers = [];

	for await (const chunk of req) {
		buffers.push(chunk);
	}

	const data = Buffer.concat(buffers).toString();
	return data;
};

export default class DomainManager {
	private logger: Logger;
	private desktopManager: DesktopManager;
	public mainPort?: number;
	constructor(parentLogger: Logger, desktopManger: DesktopManager) {
		this.logger = parentLogger.mount("domain-manager");
		this.desktopManager = desktopManger;
		APIClient.domainManager.registerDomain.override(() =>
			this.registerDomain.bind(this)
		);
	}
	subDomainsBindings = new Map<
		string,
		{
			target: string | number;
			isPublic: boolean;
		}
	>();
	registerDomain(name: string, target: string | number, isPublic = false) {
		this.logger.info(`Registering sub-domain ${name} to target ${target}`);
		this.subDomainsBindings.set(name, {
			target: Number.isInteger(target) ? "localhost:" + target : target,
			isPublic,
		});
	}
	startSubDomainServer(mainPort: number) {
		this.mainPort = mainPort;
		const getProxy = (
			req: http.IncomingMessage,
			ws = false
		): proxy | undefined => {
			try {
				const [, subDomain, token] = req.url.split("/");
				const { target, isPublic } = this.subDomainsBindings.get(subDomain);
				if (!isPublic) {
					req.url = req.url.replace(`/${subDomain}/${token}`, "");
				} else {
					req.url = req.url.replace(`/${subDomain}`, "");
				}
				const auth =
					isPublic ||
					this.desktopManager.authManager.verifyAccessToken(
						token,
						req.connection.remoteAddress
					);
				if (target && auth) {
					const proxyOptions = {
						target: `${ws ? "ws" : "http"}://${target}`,
						changeOrigin: true,
						ws,
						headers: {
							"Access-Control-Allow-Origin": "*",
						},
					};
					const reqProxy = proxy.createProxy(proxyOptions);
					return reqProxy;
				}
			} catch (err) {
				// unable to parse url
			}
		};
		const server = http.createServer(async (req, res) => {
			const reqProxy = getProxy(req);
			if (reqProxy) {
				this.logger.info(`upgrade ${req.headers.host}`);
				reqProxy.web(req, res);
				reqProxy.on("error", (err) => {
					this.logger.error(
						`upgrade ${req.headers.host} encountered error: ${err}`
					);
				});
			} else {
				if (!(await this.tryToLogin(req, res))) {
					if (req.url === "/" || req.url === "") {
						res.writeHead(301, {
							Location: `/${this.publicPathName}/`,
						});
						res.end();
						res.end();
					}
				}
			}
		});
		server.on("upgrade", (req, socket, head) => {
			const reqProxy = getProxy(req, true);
			if (reqProxy) {
				this.logger.info(`upgrade ws ${req.headers.host}`);
				reqProxy.ws(req, socket, head);
				reqProxy.on("error", (err) => {
					this.logger.error(
						`upgrade ws ${req.headers.host} encountered error: ${err}`
					);
				});
			}
		});
		server.listen(mainPort);
		this.logger.info(`Main proxy server started on port ${mainPort}`);
	}
	async tryToLogin(req: http.IncomingMessage, res: http.ServerResponse) {
		const isLogginPath = req.url === "/login";
		const isLogginPost = req.method === "POST" && isLogginPath;
		if (isLogginPost) {
			const data = await readReq(req);
			const token = this.desktopManager.authManager.authenticate(
				req.connection.remoteAddress,
				data
			);
			if (token) {
				res.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				});
				res.end(JSON.stringify({ token }));
			} else {
				res.writeHead(401, {
					"Content-Type": "application/json",
				});
				res.end(JSON.stringify({ error: "Invalid credentials" }));
			}
			return true;
		}
		return false;
	}
	publicPathName = "public";
	async hostViews() {
		const viewsPath = path.join(
			require.resolve("@web-desktop-environment/views"),
			"../../build"
		);
		const port = await this.desktopManager.portManager.getPort();
		liveServer.start({
			open: false,
			root: viewsPath,
			port,
			middleware: [
				(req, res, next) => {
					if (req.url === "") {
						res.writeHead(301, {
							Location: `/${this.publicPathName}/`,
						});
						res.end();
						return;
					}
					next();
				},
			],
			logLevel: 0,
		});
		this.registerDomain(this.publicPathName, port, true);
		this.logger.info(`Views server started on port ${port}`);
		return this.publicPathName;
	}
}
