import React from "react";
import Component from "@component";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { App } from "@apps/index";
import { Explorer } from "@apps/utils/Explorer";
import { promises as fs } from "fs-extra";
import { basename } from "path";

interface NotepadInput {
	filepath?: string;
}

interface NotepadState {
	isOpeningFile: boolean;
	file?: string;
	defaultValue?: string;
}

class Notepad extends Component<NotepadInput, NotepadState> {
	name = "notepad";
	state: NotepadState = {
		isOpeningFile: true,
	};
	componentDidMount = () => {
		if (this.props.filepath) {
			this.onSelectFile(this.props.filepath);
		}
	};
	onSelectFile = async (path: string) => {
		const content = await fs.readFile(path, { encoding: "utf-8" });
		this.setState({ file: path, defaultValue: content, isOpeningFile: false });
	};
	saveFile = (newContent: string) => {
		if (this.state.file) {
			fs.writeFile(this.state.file, newContent);
		}
	};
	renderComponent() {
		const { isOpeningFile, defaultValue, file } = this.state;
		return (
			<ViewsProvider<ViewInterfacesType>>
				{({ Notepad }) => (
					<>
						(
						<Notepad
							name={file ? basename(file) : ""}
							onSave={this.saveFile}
							isSelectingFile={isOpeningFile}
							defaultValue={defaultValue}
							path={file}
							onReselectFile={() =>
								this.setState({
									isOpeningFile: true,
									defaultValue: "",
									file: "",
								})
							}
						>
							<Explorer type="select-file" onSelect={this.onSelectFile} />
						</Notepad>
						)
					</>
				)}
			</ViewsProvider>
		);
	}
}

export const notepad: App<NotepadInput> = {
	name: "Notepad",
	description: "just a text editor",
	App: Notepad,
	defaultInput: {},
	nativeIcon: {
		icon: "filetext1",
		type: "AntDesign",
	},
	icon: {
		type: "icon",
		icon: "BiNotepad",
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
