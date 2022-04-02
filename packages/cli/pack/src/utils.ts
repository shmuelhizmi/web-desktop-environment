import path from "path";
import fs from "fs-extra";
import { spawnSync } from "child_process";

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

const run = (command: string) => {
	return spawnSync("npm", ["run", command, "--", process.cwd()], {
		stdio: "inherit",
		cwd: __dirname,
	});
};

export const vite = {
	build() {
		return run("vite:build");
	},
	dev() {
		return run("vite:dev");
	},
};
