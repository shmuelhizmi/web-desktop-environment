import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces/lib";
import { homedir } from "os";
import {
	Download,
	File,
} from "@web-desktop-environment/interfaces/lib/views/apps/utils/Explorer";
import * as fs from "fs-extra";
import { join, sep } from "path";
import { App } from "@apps/index";

interface ExplorerInput {
	path?: string;
}

const terminalFlow = <Flow<ViewInterfacesType, ExplorerInput>>(async ({
	view,
	views,
	input: { path: startingPath = homedir() },
}) => {
	let currentPath = startingPath;
	const downloads: Download[] = [];
	const listFiles = async (): Promise<File[]> => {
		const filesNames = await fs.readdir(currentPath);
		const files = await filesNames.map(
			async (file): Promise<File> => {
				try {
					const stat = await fs.stat(join(currentPath, file));
					return {
						isFolder: stat.isDirectory(),
						name: file,
						size: stat.size,
						time: stat.atime.getTime(),
					};
				} catch {
					return;
				}
			}
		);
		return (await Promise.all(files)).filter((file) => file);
	};
	const explorer = view(0, views.explorer, {
		currentPath,
		downloads,
		platfromPathSperator: sep as "/" | "\\",
		files: await listFiles(),
	});

	let isUpdatingFiles = false;
	const updateFiles = async () => {
		if (!isUpdatingFiles) {
			isUpdatingFiles = true;
			explorer.update({ files: await listFiles() });
			isUpdatingFiles = false;
		}
	};
	explorer
		.on("changeCurrentPath", async (path) => {
			currentPath = path;
			explorer.update({
				currentPath,
				files: await listFiles(),
			});
		})
		.on("createFolder", async (name) => {
			await fs.mkdir(join(currentPath, name));
			await updateFiles();
		})
		.on("delete", async (name) => {
			const file = join(currentPath, name);
			await fs.remove(file);
			await updateFiles();
		})
		.on("move", async ({ newPath, originalPath }) => {
			await fs.move(originalPath, newPath);
			await updateFiles();
		})
		.on("copy", async ({ newPath, originalPath }) => {
			await fs.copy(originalPath, newPath);
			await updateFiles();
		})
		.on("upload", async ({ data, path }) => {
			await fs.writeFile(path, data);
			await updateFiles();
		});
	await explorer;
});

export const explorer: App<ExplorerInput> = {
	name: "Explorer",
	description: "a file explorer",
	flow: terminalFlow,
	defaultInput: {},
	icon: {
		type: "icon",
		icon: "BsFillFolderFill",
	},
	window: {
		height: 600,
		width: 720,
		position: { x: 50, y: 50 },
	},
};
