import React from "react";
import { AppBase, AppsManager } from "@web-desktop-environment/app-sdk";
import { readFileSync } from "fs";
import { join } from "path";

const base64image = readFileSync(
	join(__dirname, "../../assets/funny_hamster.png"),
	{ encoding: "base64" }
);

class HamsterApp extends AppBase<{}, {}> {
	name = "hamster_app";
	state: AppBase<{}, {}>["state"] = {
		useDefaultWindow: true,
		defaultWindowTitle: "funny hamster app",
	};
	renderApp: AppBase<{}, {}>["renderApp"] = ({ About }) => {
		return (
			<About
				image={"data:image/jpeg;base64," + base64image}
				onClose={this.props.propsForRunningAsSelfContainedApp.close}
				title={"Funny Hamster"}
				info={["this hamster is FUNNY"]}
			/>
		);
	};
}
export const registerApp = () =>
	AppsManager.registerApp({
		hamster_app: {
			displayName: "Hamster App",
			description: "the hamster",
			App: HamsterApp,
			defaultInput: {},
			icon: {
				type: "icon",
				icon: "FcPuzzle",
			},
			window: {
				height: 150,
				width: 600,
				position: { x: 50, y: 50 },
				maxHeight: 150,
				maxWidth: 600,
				minWidth: 600,
				minHeight: 150,
				allowLocalScreenSnapping: false,
			},
		},
	});
