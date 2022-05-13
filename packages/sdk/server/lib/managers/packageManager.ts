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
import { platform } from "os";

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
				({ name, version }) =>
					"/" + path.join(name, version, "index.bundle.esm.js")
			);
	}
	constructor(parentLogger: Logger, private desktopManager: DesktopManager) {
		super();
		this.logger = parentLogger.mount("package-manager");
	}

	public async runPackage(wdeConfig: WDEPackageConfig, root: string) {
		if (wdeConfig.os && !wdeConfig.os.includes(platform())) {
			return;
		}
		const process = cp.spawn("node", [path.join(root, wdeConfig.entry)], {
			stdio: ["ipc"],
		});
		process.stdout.on("data", (data) => console.log(data.toString()));
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

	public startPackagesWebHostingServer = async () => {
		const server = http.createServer(async (req, res) => {
			let packageName = "";
			let versionPath = "";
			let scriptPaths: string[] = [];
			const paths = decodeURI(req.url)
				.split("/")
				.filter((p) => p);
			if (paths[0].startsWith("@")) {
				packageName = paths[0] + "/" + paths[1];
				versionPath = paths[2];
				scriptPaths = paths.slice(3);
			} else {
				packageName = paths[0];
				versionPath = paths[1];
				scriptPaths = paths.slice(2);
			}
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
		const { domain, port } = await this.desktopManager.portManager.withDomain();
		server.listen(port);
		this.logger.info(`web hosting server running on ${port}`);
		return {
			domain,
			port,
		};
	};

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
					name: wdeConfig.name,
					entry: wdeConfig.entry,
					version: wdeConfig.version,
					web: wdeConfig.web,
					webBundle: wdeConfig.webBundle,
					os: wdeConfig.os,
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
