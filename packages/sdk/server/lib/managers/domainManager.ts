import Logger from "../utils/logger";
import DesktopManager from "../managers/desktopManager";
import { APIClient } from "@web-desktop-environment/server-api";
import http from "http";
import proxy from "http-proxy";

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
	constructor(parentLogger: Logger, desktopManger: DesktopManager) {
		this.logger = parentLogger.mount("domain-manager");
		this.desktopManager = desktopManger;
		APIClient.domainManager.registerDomain.override(() =>
			this.registerDomain.bind(this)
		);
	}
	subDomainsBindings = new Map<string, string>();
	registerDomain(name: string, target: string | number) {
		this.logger.info(`Registering sub-domain ${name} to target ${target}`);
		this.subDomainsBindings.set(name, String(target));
	}
	startSubDomainServer(mainPort: number) {
		const getProxy = (
			req: http.IncomingMessage,
			ws = false
		): proxy | undefined => {
			try {
				const parsedUrl = req.headers.host;
				const [subDomain, token] = parsedUrl.split(".");
				const target = this.subDomainsBindings.get(subDomain);
				const auth = this.desktopManager.authManager.verifyAccessToken(
					token,
					req.connection.remoteAddress
				);
				if (target && auth) {
					const proxyOptions = {
						target: `${ws ? "ws" : "http"}://${target}`,
						changeOrigin: true,
						ws,
					};
					const reqProxy = proxy.createProxy(proxyOptions);
					return reqProxy;
				}
			} catch (err) {
				return;
			}
		};
		const server = http.createServer((req, res) => {
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
				this.tryToLogin(req, res);
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
		}
	}
}
