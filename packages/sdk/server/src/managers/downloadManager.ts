import Logger from "@utils/logger";
import DesktopManager from "@managers/desktopManager";
import * as http from "http";
import { promises as fs } from "fs-extra";
import { basename, extname } from "path";
import { v4 } from "uuid";
import { APIClient } from "@web-desktop-environment/server-api";

export default class DownloadManager {
	private logger: Logger;
	private desktopManager: DesktopManager;
	private files: { [hash: string]: string } = {};
	private server: http.Server;
	public port: number;
	constructor(parentLogger: Logger, desktopManger: DesktopManager) {
		this.logger = parentLogger.mount("download-manager");
		this.desktopManager = desktopManger;
		APIClient.downloadManager.addFile.override(() => (path: string) => ({
			hash: this.addFile(path),
		}));
	}
	public initialize = async () => {
		this.port = await this.desktopManager.portManager.getPort();
		this.logger.info(`starting static file server at port ${this.port}`);
		this.server = http.createServer(async (request, response) => {
			const path = this.files[request.url.replace("/", "")]; // from "/${hash}.${ext}" to "${hash}.${ext}"
			this.logger.info(`user request to download ${path}`);
			if (path) {
				try {
					const content = await fs.readFile(path);
					response.writeHead(200, {
						"Content-Disposition": "attachment",
						filename: basename(path),
					});
					response.end(content, "utf-8");
				} catch {
					response.writeHead(500);
					response.end("unable to find file in file system");
				}
			} else {
				response.writeHead(403);
				response.end("this link is not valid");
			}
		});
		this.server.listen(this.port);
	};
	public addFile = (path: string) => {
		const hash = v4() + extname(path);
		this.files[hash] = path;
		return hash;
	};
}
