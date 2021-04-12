import React from "react";
import { homedir } from "os";
import * as cp from "child_process";
import axios from "axios";
import { AppBase, AppsManager } from "@web-desktop-environment/app-sdk";

interface VSCodeInput {
	process?: string;
	args?: string[];
	location?: string;
}

interface VSCodeState {
	port?: number;
	isLoaded: boolean;
}

class VSCode extends AppBase<VSCodeInput, VSCodeState> {
	name = "vscode";
	state: AppBase<VSCodeInput, VSCodeState>["state"] = {
		isLoaded: false,
		useDefaultWindow: true,
		defaultWindowTitle: "vs-code",
	};

	vscode: cp.ChildProcessWithoutNullStreams;

	willUnmount = false;

	runVsCodeCli = (port: number): void => {
		this.vscode = cp.spawn(
			"npm",
			[
				"run",
				"code-server",
				"--",
				`--port=${port}`,
				"--auth=none",
				"--host=0.0.0.0",
			],
			{ cwd: __dirname }
		);
		const waitForVscodeToLoad = () => {
			if (!this.willUnmount) {
				axios
					.get("http://localhost:" + port)
					.then(() => !this.willUnmount && this.setState({ isLoaded: true }))
					.catch(() => {
						setTimeout(() => waitForVscodeToLoad(), 250);
					});
			}
		};
		waitForVscodeToLoad();
	};

	componentWillUnmount = () => {
		this.willUnmount = true;
		this.vscode.kill();
	};

	componentDidMount = () => {
		this.api.portManager.getPort().then(({ port }) => {
			this.setState({ port });
			this.runVsCodeCli(port);
		});
	};

	renderApp: AppBase<VSCodeInput, VSCodeState>["renderApp"] = ({
		Iframe,
		LoadingScreen,
	}) => {
		const { port, isLoaded } = this.state;

		return port && isLoaded ? (
			<Iframe port={port} />
		) : (
			<LoadingScreen message={"loading vs-code"} variant="jumpCube" />
		);
	};
}

export const registerApp = () =>
	AppsManager.registerApp({
		vscode: {
			displayName: "VS-Code",
			description: "full vscode editor",
			App: VSCode,
			defaultInput: { location: homedir() },
			icon: {
				type: "icon",
				icon: "VscCode",
			},
			window: {
				height: 700,
				width: 1000,
				position: { x: 50, y: 50 },
				maxHeight: 7000,
				maxWidth: 7000,
				minWidth: 500,
				minHeight: 500,
				allowLocalScreenSnapping: true,
			},
		},
	});
