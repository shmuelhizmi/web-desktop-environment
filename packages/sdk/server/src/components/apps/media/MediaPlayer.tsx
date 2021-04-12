import React from "react";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { Explorer } from "@apps/utils/Explorer";
import { basename } from "path";
import { AppsManager, AppBase } from "@web-desktop-environment/app-sdk";

interface PlayerInput {
	filepath?: string;
}

interface PlayerState {
	isOpeningFile: boolean;
	file?: string;
	source?: string;
	port?: number;
}

class Player extends AppBase<PlayerInput, PlayerState> {
	name = "mediaPlayer";
	constructor(props: AppBase<PlayerInput, PlayerState>["props"]) {
		super(props);
		this.state = {
			isOpeningFile: true,
			useDefaultWindow: true,
			defaultWindowTitle: "media player",
		};
	}
	componentDidMount = () => {
		const { filepath } = this.props.input;
		if (filepath) {
			this.onSelectFile(filepath);
		}
	};
	onSelectFile = async (path: string) => {
		this.setState({ file: path, isOpeningFile: false });
		const [{ hash: source }, port] = await Promise.all([
			this.api.downloadManager.addFile(path),
			this.api.downloadManager.getDownloadManagerPort(),
		]);
		this.setState({ port, source });
	};
	renderApp: AppBase<PlayerInput, PlayerState>["renderApp"] = ({
		MediaPlayer,
	}) => {
		const { isOpeningFile, file, port, source } = this.state;
		return (
			<MediaPlayer
				name={file ? basename(file) : ""}
				isSelectingFile={isOpeningFile}
				path={file}
				source={source}
				port={port}
				onReselectFile={() =>
					this.setState({
						isOpeningFile: true,
						file: "",
					})
				}
			>
				<Explorer
					parentLogger={this.logger}
					input={{
						type: "select-file",
					}}
					propsForRunningAsChildApp={{ onSelect: this.onSelectFile }}
				/>
			</MediaPlayer>
		);
	};
}

export const registerApp = () =>
	AppsManager.registerApp({
		mediaPlayer: {
			displayName: "Media",
			description: "just a Video and Audio media player",
			App: Player,
			defaultInput: {},
			icon: {
				type: "icon",
				icon: "FcVideoCall",
			},
			window: {
				height: 800,
				width: 650,
				position: { x: 100, y: 20 },
				maxHeight: 900,
				maxWidth: 1200,
				minWidth: 550,
				minHeight: 370,
			},
		},
	});
