import React, { useState } from "react";
import { WindowBar } from "@views/Desktop";
import { Explorer, Notepad, Settings, Window } from "@views/index";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { Themes } from "@root/theme";
import { ThemeProvider } from "@material-ui/styles";

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

const App = () => {
	const [background, setBackground] = useState(
		'url("https://picsum.photos/id/1039/1920/1080")'
	);
	const [theme, setTheme] = useState<Theme>(Themes.dark);
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
					window={{
						position: { x: 100, y: 100 },
						minWidth: 600,
						minHeight: 550,
					}}
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
					window={{
						position: { x: 850, y: 100 },
						minWidth: 600,
						minHeight: 550,
					}}
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
					window={{
						position: { x: 500, y: 300 },
						minWidth: 600,
						minHeight: 550,
					}}
				>
					<Settings
						onReload={emptyFunction}
						setSettings={async (newSettings) => {
							setBackground(newSettings.desktop.background);
							if (newSettings.desktop.theme !== theme.type) {
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
