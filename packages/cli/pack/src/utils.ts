import path from "path";
import fs from "fs-extra";

export function copyTemplate(templatePath: string, targetPath: string) {
	const filesOrFolders = fs.readdirSync(templatePath);
	filesOrFolders.forEach((fileOrFolder) => {
		const fileOrFolderPath = path.join(templatePath, fileOrFolder);
		const targetFileOrFolderPath = path.join(
			targetPath,
			fileOrFolder.replace(".template", "")
		);
		if (fs.lstatSync(fileOrFolderPath).isDirectory()) {
			fs.ensureDirSync(targetFileOrFolderPath);
			copyTemplate(fileOrFolderPath, targetFileOrFolderPath);
		} else {
			fs.copySync(fileOrFolderPath, targetFileOrFolderPath);
		}
	});
}

import { exec } from "child_process";

const run = (command: string) => {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error || stderr);
			} else {
				resolve(stdout);
			}
		});
	});
};

export const vite = {
	build() {
		return run("vite build");
	},
	dev() {
		return run("vite");
	},
};
