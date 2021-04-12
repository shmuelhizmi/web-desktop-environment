import React from "react";
import socketIO from "socket.io";
import * as http from "http";
import { getOS, OS } from "@utils/getOS";
import { tmpdir } from "os";
import { spawn, IPty } from "node-pty";
import { AppBase, AppsManager } from "@web-desktop-environment/app-sdk";

interface TerminalInput {
	process?: string;
	args?: string[];
	location?: string;
}

interface TerminalState {
	port?: number;
}

export const maxTerminalHistoryLength = 100000;
class Terminal extends AppBase<TerminalInput, TerminalState> {
	constructor(props: AppBase<TerminalInput, TerminalState>["props"]) {
		super(props);
		this.state = {
			useDefaultWindow: true,
			defaultWindowTitle: "terminal",
		};
	}
	name = "terminal";
	server = http.createServer();
	socketServer = new socketIO.Server(this.server);
	history = "";
	ptyProcess = new PTY(
		(data) => {
			this.history += data;
			this.history = this.history.slice(
				this.history.length - maxTerminalHistoryLength,
				this.history.length
			);
			this.socketServer.emit("output", data);
		},
		this.props.input.process,
		this.props.input.location,
		this.props.input.args
	);

	componentDidUnmount = false;
	onComponentWillUnmount: Function[] = [];
	componentWillUnmount = () => {
		this.componentDidUnmount = true;
		this.onComponentWillUnmount.forEach((f) => f());
	};

	componentDidMount = () => {
		this.api.portManager.getPort().then(({ port }) => {
			this.server.listen(port);
			this.setState({ port });
		});
		this.socketServer.on("connection", (client) => {
			this.socketServer.emit("output", this.history);
			client.on("input", (data: string) => {
				this.ptyProcess.write(data);
			});

			client.on("setColumns", (columns: number) => {
				// fit columns to window size
				this.ptyProcess.setCols(columns);
			});
		});
		let lastProcessName = "";
		const updateCurrentProcess = setInterval(() => {
			const newProcessName = this.ptyProcess.ptyProcess.process;
			if (lastProcessName !== newProcessName) {
				lastProcessName = newProcessName;
				this.setState({
					defaultWindowTitle: `terminal : ${lastProcessName}`,
				});
			}
		}, 100);
		this.ptyProcess.ptyProcess.onExit(() => {
			if (
				!this.componentDidUnmount &&
				this.props.propsForRunningAsSelfContainedApp
			) {
				this.props.propsForRunningAsSelfContainedApp.close();
			}
		});
		this.onComponentWillUnmount.push(() => {
			clearInterval(updateCurrentProcess);
		});
	};

	renderApp: AppBase<TerminalInput, TerminalState>["renderApp"] = ({
		Terminal,
	}) => {
		const { port } = this.state;
		return port && <Terminal port={port} />;
	};
}

const getDefaultBash = () => {
	if (process.env.SHELL) {
		return process.env.SHELL;
	}
	const os = getOS();
	if (os === OS.Linux) {
		return "bash";
	}
	if (os === OS.Window) {
		return "cmd";
	}
	if (os === OS.Mac) {
		return "bash";
	}
	if (os === OS.Other) {
		return "bash";
	}
};

export const registerApp = () =>
	AppsManager.registerApp({
		terminal: {
			displayName: "Terminal",
			description: "a terminal window",
			App: Terminal,
			defaultInput: {
				process: getDefaultBash(),
				args: ["-i"],
				location: tmpdir(),
			},
			icon: {
				type: "icon",
				icon: "FcCommandLine",
			},
			window: {
				height: 400,
				width: 1000,
				position: { x: 50, y: 50 },
				maxHeight: 900,
				maxWidth: 1200,
				minWidth: 350,
				minHeight: 200,
				allowLocalScreenSnapping: true,
			},
		},
	});

// from https://svaddi.dev/how-to-create-web-based-terminals/;
class PTY {
	shell: string;
	public ptyProcess: IPty;
	out: (data: string) => void;
	constructor(out: (data) => void, shell: string, cwd: string, args: string[]) {
		// Setting default terminals based on user os
		this.shell = shell;
		this.ptyProcess = null;
		this.out = out;

		// Initialize PTY process.
		this.startPtyProcess(cwd, args);
	}

	setCols = (columns: number) => {
		try {
			this.ptyProcess.resize(columns, this.ptyProcess.rows);
		} catch (e) {
			/* */
		}
	};
	/**
	 * Spawn an instance of pty with a selected shell.
	 */
	startPtyProcess(cwd: string, args: string[]) {
		this.ptyProcess = spawn(this.shell, args, {
			name: "xterm-color",
			cwd,
		});

		// Add a "data" event listener.
		this.ptyProcess.onData((data) => {
			// Whenever terminal generates any data, send that output to socket.io client
			this.sendToClient(data);
		});
	}

	exitPtyProcess() {
		this.ptyProcess.kill();
	}

	/**
	 * Use this function to send in the input to Pseudo Terminal process.
	 * @param {*} data Input from user like a command sent from terminal UI
	 */

	write(data) {
		this.ptyProcess.write(data);
	}

	sendToClient(data: string) {
		// Emit data to socket.io client in an event "output"
		this.out(data);
	}
}
