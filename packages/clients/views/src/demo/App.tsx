import React, { useState } from "react";
import { WindowBar } from "@views/Desktop";
import { Explorer, Notepad, Settings, Window } from "@views/index";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { Window as WindowState } from "@web-desktop-environment/interfaces/lib/shared/window";
import { WindowState as WindowStateUpdate } from "@web-desktop-environment/interfaces/lib/views/Window";
import { Themes } from "@root/theme";
import { ThemeProvider } from "@mui/styles";

const emptyFunction = async () => {
	/* empty body */
};
const defaultWindowProps = {
	background: "",
	setWindowState: emptyFunction,
	onClose: emptyFunction,
	onLaunchApp: emptyFunction,
	window: {},
};

const useWindow = (initialState: WindowState) => {
	const [state, setState] = useState(initialState);
	return {
		state,
		setWindowState: async (newWindowState: WindowStateUpdate) => {
			setState({
				...state,
				...newWindowState.size,
				position: newWindowState.position || state.position,
			});
		},
	};
};

const App = () => {
	const [background, setBackground] = useState(
		'url("https://picsum.photos/id/1039/1920/1080")'
	);
	const [theme, setTheme] = useState<Theme>(Themes.dark);

	const explorerWindow = useWindow({
		position: { x: 50, y: 100 },
		minWidth: 600,
		minHeight: 550,
		height: 500,
		width: 800,
	});
	const notepadWindow = useWindow({
		position: { x: 950, y: 50 },
		minWidth: 600,
		minHeight: 550,
		height: 750,
		width: 700,
	});
	const settingsWindow = useWindow({
		position: { x: 700, y: 300 },
		minWidth: 600,
		minHeight: 550,
		height: 600,
		width: 900,
	});
	return (
		<div
			style={{
				background,
				position: "absolute",
				width: "100%",
				height: "100%",
			}}
		>
			<ThemeProvider theme={theme}>
				<Window
					title={"explorer"}
					name={"explorer"}
					icon={{
						type: "icon",
						icon: "FcFolder",
					}}
					{...defaultWindowProps}
					window={explorerWindow.state}
					setWindowState={explorerWindow.setWindowState}
				>
					<Explorer
						currentPath={"/home/web-desktop-environment"}
						files={[
							{ isFolder: true, name: "Documents" },
							{ isFolder: true, name: "Desktop" },
							{ isFolder: true, name: "Music" },
							{ isFolder: false, name: "passwords.txt" },
							{ isFolder: false, name: "secrets.txt" },
						]}
						onChangeCurrentPath={emptyFunction}
						onCopy={emptyFunction}
						onOpen={emptyFunction}
						onCreateFile={emptyFunction}
						onCreateFolder={emptyFunction}
						onDelete={emptyFunction}
						onMove={emptyFunction}
						onRequestDownloadLink={() => new Promise(emptyFunction)}
						onUpload={emptyFunction}
						platformPathSeparator={"/"}
						type={"explore"}
					/>
				</Window>
				<Window
					title={"notepad"}
					name={"notepad"}
					icon={{
						type: "icon",
						icon: "FcFile",
					}}
					{...defaultWindowProps}
					window={notepadWindow.state}
					setWindowState={notepadWindow.setWindowState}
				>
					<Notepad
						defaultValue={
							"list of all my passwords:\n1. 12345Password\n2. passworD12345"
						}
						isSelectingFile={false}
						name="passwords.txt"
						onReselectFile={emptyFunction}
						onSave={emptyFunction}
						path={"/home/web-desktop-environment/passwords.txt"}
					/>
				</Window>
				<Window
					title={"settings"}
					name={"settings"}
					icon={{
						type: "icon",
						icon: "FcSettings",
					}}
					{...defaultWindowProps}
					window={settingsWindow.state}
					setWindowState={settingsWindow.setWindowState}
				>
					<Settings
						onReload={emptyFunction}
						setSettings={async (newSettings) => {
							setBackground(newSettings.desktop.background);
							if (newSettings.desktop.theme !== theme.name) {
								if (newSettings.desktop.theme === "custom") {
									setTheme(newSettings.desktop.customTheme || Themes.dark);
								} else {
									setTheme(Themes[newSettings.desktop.theme]);
								}
							}
						}}
						settings={{
							desktop: {
								theme: theme.type,
								background,
								nativeBackground: "",
								customTheme: theme,
							},
							network: {
								ports: {
									endPort: 9300,
									mainPort: 5000,
									startPort: 9200,
								},
							},
						}}
					/>
				</Window>
				<WindowBar
					isStartMenuOpen={false}
					toggleStartMenu={() => {
						/* intently empty */
					}}
				/>
			</ThemeProvider>
		</div>
	);
};

export default App;
