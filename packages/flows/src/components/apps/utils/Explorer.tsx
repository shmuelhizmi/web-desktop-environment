import React from "react";
import Component from "@component";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { homedir } from "os";
import {
	File,
	Move,
	Upload,
	ExplorerViewType,
} from "@web-desktop-environment/interfaces/lib/views/apps/utils/Explorer";
import * as fs from "fs-extra";
import { join, sep } from "path";
import { App } from "@apps/index";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces/lib";

interface ExplorerInput {
	path?: string;
	isCurrentApp?: boolean;
	type: ExplorerViewType;
	onSelect?: (path: string) => void;
}

interface ExplorerState {
	currentPath: string;
	files: File[];
}

class Explorer extends Component<ExplorerInput, ExplorerState> {
	name = "explorer";
	state: ExplorerState = {
		currentPath: this.props.path || homedir(),
		files: [],
	};
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
		return (await Promise.all(files)).filter((file) => file);
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
		const hash = this.desktopManager.downloadManager.addFile(path);
		this.logger.info(
			`user request download link for ${path} secret hash is ${hash}`
		);
		return {
			path: `/${hash}`,
			port: this.desktopManager.downloadManager.port,
		};
	};
	componentDidMount = () => {
		this.listFiles(this.state.currentPath).then((files) =>
			this.setState({ files })
		);
	};
	renderComponent() {
		const { type } = this.props;
		const { currentPath, files } = this.state;
		return (
			<ViewsProvider<ViewInterfacesType>>
				{({ Explorer }) => (
					<Explorer
						currentPath={currentPath}
						files={files}
						platfromPathSperator={sep}
						type={type}
						onChangeCurrentPath={(path) => {
							this.changeCurrentPath(path);
							if (this.windowContext && this.props.isCurrentApp) {
								this.windowContext.setWindowTitle(`explorer - ${currentPath}`);
							}
						}}
						onCopy={this.copy}
						onCreateFolder={this.createFolder}
						onDelete={this.delete}
						onMove={this.move}
						onRequestDownloadLink={this.requestDownloadLink}
						onUpload={this.upload}
						onSelect={this.props.onSelect}
					/>
				)}
			</ViewsProvider>
		);
	}
}

export { Explorer };

export const explorer: App<ExplorerInput> = {
	name: "Explorer",
	description: "a file explorer",
	App: Explorer,
	defaultInput: { path: homedir(), type: "explore", isCurrentApp: true },
	icon: {
		type: "icon",
		icon: "BsFillFolderFill",
	},
	nativeIcon: {
		icon: "folder-multiple",
		type: "MaterialCommunityIcons",
	},
	window: {
		height: 600,
		width: 720,
		position: { x: 150, y: 150 },
		maxHeight: 800,
		maxWidth: 1200,
		minHeight: 450,
		minWidth: 600,
	},
};
