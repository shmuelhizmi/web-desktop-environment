import React from "react";
import Component from "@component";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { App } from "@apps/index";
import { Explorer } from "@apps/utils/Explorer";
import { basename } from "path";

interface PlayerInput {
	filepath?: string;
}

interface PlayerState {
	isOpeningFile: boolean;
	file?: string;
}

class Player extends Component<PlayerInput, PlayerState> {
	name = "Player";
	state: PlayerState = {
		isOpeningFile: true,
	};
	componentDidMount = () => {
		if (this.props.filepath) {
			this.onSelectFile(this.props.filepath);
		}
	};
	onSelectFile = async (path: string) => {
		this.setState({ file: path, isOpeningFile: false });
	};
	renderComponent() {
		const { isOpeningFile, file } = this.state;
		return (
			<ViewsProvider<ViewInterfacesType>>
				{({ MediaPlayer }) => {
					return (
						<>
							(
							<MediaPlayer
								name={file ? basename(file) : ""}
								isSelectingFile={isOpeningFile}
								path={file}
								source={
									file ? this.desktopManager.downloadManager.addFile(file) : ""
								}
								port={this.desktopManager.downloadManager.port}
								onReselectFile={() =>
									this.setState({
										isOpeningFile: true,
										file: "",
									})
								}
							>
								<Explorer type="select-file" onSelect={this.onSelectFile} />
							</MediaPlayer>
							)
						</>
					);
				}}
			</ViewsProvider>
		);
	}
}

export const mediaPlayer: App<PlayerInput> = {
	name: "Media",
	description: "just a Video and Audio media player",
	App: Player,
	defaultInput: {},
	nativeIcon: {
		icon: "video",
		type: "Entypo",
	},
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
};
