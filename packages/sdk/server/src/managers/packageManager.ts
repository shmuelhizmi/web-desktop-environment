import cp from "child_process";
import os from "os";
import { promises as fs } from "fs-extra";
import { APIClient } from "@web-desktop-environment/server-api";
import Logger from "@root/utils/logger";

class PackageManager {
	private discoveredPackages: string[] = [];
	private runningPackages: string[] = [];
	private logger: Logger;
	constructor(parentLogger: Logger) {
		this.logger = parentLogger.mount("package-manager");
		APIClient.packageManager.scanForNewPackages.override(() => () =>
			this.searchForNewPackages()
		);
	}
	public async searchForNewPackages() {
		if (os.platform() === "linux" || os.platform() === "darwin") {
			const nodeBinFolders = process.env.PATH.split(":").filter((path) =>
				path.endsWith("node_modules/.bin")
			);
			const folderWeCouldNotOpen: string[] = [];
			const promises = nodeBinFolders.map((folder) =>
				fs
					.readdir(folder)
					.then((binFiles) => {
						binFiles.forEach((binFile) => {
							if (binFile.startsWith("web-desktop-package-")) {
								if (!this.discoveredPackages.includes(binFile)) {
									this.discoveredPackages.push(binFile);
									this.runningPackages.push(binFile);
									const newProcess = cp.spawn(binFile, { stdio: ["ipc"] });
									newProcess.on(
										"exit",
										() =>
											(this.runningPackages = this.runningPackages.filter(
												(currentPackage) => currentPackage !== binFile
											))
									);
									APIClient.addChildProcess(newProcess);
								}
							}
						});
					})
					.catch(() => {
						folderWeCouldNotOpen.push(folder);
					})
			);
			await Promise.all(promises);
			if (folderWeCouldNotOpen.length > 0) {
				this.logger.warn(
					`we could not search ${folderWeCouldNotOpen.length} directories for web desktop packages`
				);
			}
		}
	}
}

export default PackageManager;
