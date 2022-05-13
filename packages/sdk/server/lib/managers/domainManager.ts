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
	public mainPort?: number;
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
		this.mainPort = mainPort;
		const getProxy = (
			req: http.IncomingMessage,
			ws = false
		): proxy | undefined => {
			try {
				const [, subDomain, token] = req.url.split("/");
				req.url = req.url.replace(`/${subDomain}/${token}`, "");
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
						headers: {
							"Access-Control-Allow-Origin": "*",
						},
					};
					const reqProxy = proxy.createProxy(proxyOptions);
					return reqProxy;
				}
			} catch (err) {
				return;
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
					if (req.url === "/") {
						const https = req.headers["x-forwarded-proto"] === "https";
						const port = Number(
							req.headers.host.split(":")[1] || https ? 443 : 80
						);
						const host = req.headers.host.split(":")[0];
						const passcode = req.url?.slice(1);
						const link = {
							port,
							host,
							https,
							passcode: passcode.length === 8 ? passcode : "",
						};
						res.writeHead(200, {
							"Content-Type": "text/html",
							"Access-Control-Allow-Origin": "*",
						});
						res.write(
							`
							<!DOCTYPE html>
							<html>
								<head>
									<meta charset="utf-8">
									<meta name="viewport" content="width=device-width, initial-scale=1">
									<title>Web Desktop</title>
									<meta http-equiv="Refresh" content="0; URL=http://http.web-desktop.run/#${JSON.stringify(
										link
									)}">
								</head>
								<body>
									<p>Redirecting to login panel</p>
									<script>
									${
										!link.https
											? `window.location.replace("http://http.web-desktop.run/#${encodeURIComponent(
													JSON.stringify(link)
											  )}");`
											: `window.location.replace("https://web-desktop.run/#${encodeURIComponent(
													JSON.stringify(link)
											  )}");`
									}
									</script>
								</body>
							</html>
								`
						);
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
}
