import cp from "child_process";
import { APIClient } from "@web-desktop-environment/server-api";
import { WDEPackageConfig } from "@web-desktop-environment/interfaces/lib/shared/package";
import path from "path";
import Logger from "../utils/logger";
import fs from "fs-extra";

class PackageManager {
	private logger: Logger;
	private runningPackages: string[] = [];
	constructor(parentLogger: Logger) {
		this.logger = parentLogger.mount("package-manager");
	}
	public async runPackage(wdeConfig: WDEPackageConfig, root: string) {
		const process = cp.spawn("ts-node", [path.join(root, wdeConfig.entry)], {
			stdio: ["ipc"],
		});
		this.runningPackages.push(wdeConfig.name);
		this.logger.info(`running package ${wdeConfig.name}`);
		process.on("exit", (code) => {
			this.runningPackages.splice(
				this.runningPackages.indexOf(wdeConfig.name),
				1
			);
			this.logger.info(`package ${wdeConfig.name} exited with code ${code}`);
		});
		APIClient.addChildProcess(process);
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
				const run = () => this.runPackage(wdeConfig, packageLocation);
				if (shouldRun) run();

				return {
					name: wdeConfig.name,
					location: packageLocation,
					run,
				};
			})
		);
	}
}

export default PackageManager;
