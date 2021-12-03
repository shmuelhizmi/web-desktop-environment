import React from "react";
import { Explorer } from "./Explorer";
import { promises as fs } from "fs-extra";
import { basename } from "path";
import { AppBase } from "@web-desktop-environment/app-sdk";
import { AppsManager } from "@web-desktop-environment/app-sdk";

interface NotepadInput {
	filepath?: string;
}

interface NotepadState {
	isOpeningFile: boolean;
	file?: string;
	defaultValue?: string;
}

class Notepad extends AppBase<NotepadInput, NotepadState> {
	constructor(props: AppBase<NotepadInput, NotepadState>["props"]) {
		super(props);
		this.state = {
			isOpeningFile: true,
			useDefaultWindow: true,
			defaultWindowTitle: "notepad",
		};
	}
	name = "notepad";
	componentDidMount = () => {
		const { filepath } = this.props.input;
		if (filepath) {
			this.onSelectFile(filepath);
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
	renderApp: AppBase<NotepadInput, NotepadState>["renderApp"] = ({
		Notepad,
	}) => {
		const { isOpeningFile, defaultValue, file } = this.state;
		return (
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
				<Explorer
					parentLogger={this.logger}
					input={{ type: "select-file" }}
					propsForRunningAsChildApp={{
						onSelect: this.onSelectFile,
					}}
				/>
			</Notepad>
		);
	};
}

export const registerApp = () => {
	AppsManager.registerApp({
		notepad: {
			displayName: "Notepad",
			description: "just a text editor",
			App: Notepad,
			defaultInput: {},
			icon: {
				type: "icon",
				icon: "FcFile",
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
};
