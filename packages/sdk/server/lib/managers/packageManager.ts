import cp from "child_process";
import { APIClient } from "@web-desktop-environment/server-api";
import { WDEPackageConfig } from "@web-desktop-environment/interfaces/lib/shared/package";
import path from "path";
import Logger from "../utils/logger";
import fs from "fs-extra";
import Emitter from "../utils/emitter";
import http from "http";
import mimetype from "mime-types";
import DesktopManager from "./desktopManager";

interface PackageManagerEvents {
	install: WDEPackageConfig;
	unload: WDEPackageConfig;
}
class PackageManager extends Emitter<PackageManagerEvents> {
	private logger: Logger;
	private runningPackages: Map<
		string,
		WDEPackageConfig & { location: string }
	> = new Map();
	public get packages() {
		return Array.from(this.runningPackages.values());
	}
	public get packagesViewsImportPaths() {
		return this.packages
			.filter((p) => p.webBundle)
			.map(
				({ name, version, webBundle: { index } }) =>
					"/" + path.join(name, version, index)
			);
	}
	constructor(parentLogger: Logger, private desktopManager: DesktopManager) {
		super();
		this.logger = parentLogger.mount("package-manager");
	}

	public async runPackage(wdeConfig: WDEPackageConfig, root: string) {
		const process = cp.spawn("ts-node", [path.join(root, wdeConfig.entry)], {
			stdio: ["ipc"],
		});
		this.runningPackages.set(wdeConfig.name, { ...wdeConfig, location: root });
		this.logger.info(`running package ${wdeConfig.name}`);
		process.on("exit", (code) => {
			this.runningPackages.delete(wdeConfig.name);
			this.logger.info(`package ${wdeConfig.name} exited with code ${code}`);
			this.call("unload", wdeConfig);
		});
		APIClient.addChildProcess(process);
		this.call("install", wdeConfig);
	}

	public async packagesWebHostingServer() {
		const server = http.createServer(async (req, res) => {
			const [packageName, versionPath, ...scriptPaths] = req.url
				.split("/")
				.filter((p) => p);
			if (!this.runningPackages.has(packageName)) {
				res.writeHead(404);
				res.end();
				return;
			}
			const wdeConfig = this.runningPackages.get(packageName);
			const { location, webBundle, version } = wdeConfig;
			if (!webBundle || (versionPath !== version && versionPath !== "*")) {
				res.writeHead(404);
				res.end();
				return;
			}
			const scriptPath = path.join(location, webBundle.distDir, ...scriptPaths);
			if (!(await fs.pathExists(scriptPath))) {
				res.writeHead(404);
				res.end();
				return;
			}
			const mimeType = mimetype.lookup(scriptPath);
			res.writeHead(200, {
				"Content-Type": (mimeType || "text/plain") + "; charset=utf-8",
				"Cache-Control": "public, max-age=31536000",
				"Access-Control-Allow-Origin": "*",
			});
			res.end(await fs.readFile(scriptPath));
		});
		const { domain, port } = await this.desktopManager.portManager.withDomian();
		server.listen(port);
		this.logger.info(`web hosting server running on ${port}`);
		return {
			domain,
			port,
		};
	}

	public async searchForNewPackages(apps: string[], shouldRun = false) {
		return Promise.all(
			apps.map(async (app) => {
				const packageLocation = path.dirname(
					require.resolve(path.join(app, "package.json"))
				);
				const wdeConfig: WDEPackageConfig = await fs.readJSON(
					path.join(packageLocation, "wde.config.json")
				);
				const parsedConfig: WDEPackageConfig = {
					name: encodeURIComponent(wdeConfig.name),
					entry: wdeConfig.entry,
					version: encodeURIComponent(wdeConfig.version),
					web: wdeConfig.web,
					webBundle: wdeConfig.webBundle,
				};
				const run = () => this.runPackage(parsedConfig, packageLocation);
				if (shouldRun) run();

				return {
					name: parsedConfig.name,
					location: packageLocation,
					run,
				};
			})
		);
	}
}

export default PackageManager;
