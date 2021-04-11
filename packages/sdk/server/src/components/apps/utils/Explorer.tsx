import React from "react";
import { homedir } from "os";
import {
	File,
	Move,
	Upload,
	ExplorerViewType,
} from "@web-desktop-environment/interfaces/lib/views/apps/utils/Explorer";
import * as fs from "fs-extra";
import { basename, join, sep } from "path";
import { AppBase, AppsManager } from "@web-desktop-environment/app-sdk";
interface ExplorerInput {
	location?: string;
	isCurrentApp?: boolean;
	type: ExplorerViewType;
}

interface InternalExplorerInput {
	onSelect?: (path: string) => void;
}

interface ExplorerState {
	currentPath: string;
	files: File[];
}

class Explorer extends AppBase<
	ExplorerInput,
	ExplorerState,
	InternalExplorerInput
> {
	name = "explorer";
	constructor(props: Explorer["props"]) {
		super(props);
		this.state = {
			currentPath: this.props.input.location || homedir(),
			files: [],
			useDefaultWindow: true,
			defaultWindowTitle: "explorer",
		};
	}
	listFiles = async (currentPath: string): Promise<File[]> => {
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
		return (await Promise.all<File>(files)).filter((file) => file);
	};
	isUpdatingFiles = false;
	updateFiles = async () => {
		if (!this.isUpdatingFiles) {
			this.isUpdatingFiles = true;
			this.setState({ files: await this.listFiles(this.state.currentPath) });
			this.isUpdatingFiles = false;
		}
	};
	changeCurrentPath = async (path: string) => {
		this.setState({
			currentPath: path,
			files: await this.listFiles(path),
		});
	};
	createFolder = async (path: string) => {
		await fs.mkdir(path);
		await this.updateFiles();
	};
	createFile = async (path: string) => {
		await fs.writeFile(path, "");
		await this.updateFiles();
	};
	onOpen = async (path: string) => {
		this.api.appsManager.launchApp("notepad", { filepath: path });
	};
	delete = async (file) => {
		await fs.remove(file);
		await this.updateFiles();
	};
	move = async ({ newPath, originalPath }: Move) => {
		await fs.move(originalPath, newPath);
		await this.updateFiles();
	};
	copy = async ({ newPath, originalPath }: Move) => {
		await fs.copy(originalPath, newPath);
		await this.updateFiles();
	};
	upload = async ({ data, path }: Upload) => {
		await fs.writeFile(path, data);
		await this.updateFiles();
	};
	requestDownloadLink = async (path: string) => {
		const [hash, port] = await Promise.all([
			this.api.downloadManager.addFile(path),
			this.api.downloadManager.getDownloadManagerPort(),
		]);
		this.logger.info(
			`user request download link for ${path} secret hash is ${hash}`
		);
		return {
			path: `/${hash}`,
			port,
		};
	};
	componentDidMount = () => {
		this.listFiles(this.state.currentPath).then((files) =>
			this.setState({ files })
		);
	};
	onChangeCurrentPath = (path) => {
		this.changeCurrentPath(path);
		this.setState({ defaultWindowTitle: `explorer: ${basename(path)}` });
	};

	renderApp: AppBase<ExplorerInput, ExplorerState>["renderApp"] = ({
		Explorer,
	}) => {
		const { type } = this.props.input;
		const { currentPath, files } = this.state;
		return (
			<Explorer
				currentPath={currentPath}
				files={files}
				platformPathSeparator={sep}
				type={type}
				onChangeCurrentPath={this.onChangeCurrentPath}
				onOpen={this.onOpen}
				onCopy={this.copy}
				onCreateFile={this.createFile}
				onCreateFolder={this.createFolder}
				onDelete={this.delete}
				onMove={this.move}
				onRequestDownloadLink={this.requestDownloadLink}
				onUpload={this.upload}
				onSelect={this.props.propsForRunningAsChildApp?.onSelect}
			/>
		);
	};
}

export { Explorer };

export const registerApp = () => {
	AppsManager.registerApp({
		explorer: {
			description: "a file explorer",
			App: Explorer,
			defaultInput: {
				location: homedir(),
				type: "explore",
				isCurrentApp: true,
			},
			icon: {
				type: "icon",
				icon: "FcFolder",
			},
			displayName: "Explorer",
			window: {
				height: 600,
				width: 720,
				position: { x: 150, y: 150 },
				maxHeight: 800,
				maxWidth: 1200,
				minHeight: 450,
				minWidth: 600,
			},
		},
	});
};
