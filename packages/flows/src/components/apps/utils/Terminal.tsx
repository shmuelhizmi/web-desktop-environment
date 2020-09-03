import React from "react";
import Component from "@component";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { App } from "@apps/index";
import * as socket from "socket.io";
import * as http from "http";
import { getOS, OS } from "@utils/getOS";
import { tmpdir } from "os";
import { spawn, IPty } from "node-pty";

interface TerminalInput {
	process?: string;
	args?: string[];
	location?: string;
}

interface TerminalState {
	port?: number;
}

class Terminal extends Component<TerminalInput, TerminalState> {
	name = "terminal";
	server = http.createServer();
	socketServer = socket.listen(this.server);
	history = "";
	ptyProcess = new PTY(
		(data) => {
			this.history += data;
			this.socketServer.emit("output", data);
		},
		this.props.process,
		this.props.location,
		this.props.args
	);
	state: TerminalState = {};
	componentDidMount = () => {
		this.desktopManager.portManager.getPort().then((port) => {
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
	};
	renderComponent() {
		const { port } = this.state;
		return (
			<ViewsProvider<ViewInterfacesType>>
				{({ Terminal: TerminalView }) => port && <TerminalView port={port} />}
			</ViewsProvider>
		);
	}
}

const getDefaultBash = () => {
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

export const terminal: App<TerminalInput> = {
	name: "Terminal",
	description: "a terminal window",
	App: Terminal,
	defaultInput: { process: getDefaultBash(), args: ["-i"], location: tmpdir() },
	nativeIcon: {
		icon: "console",
		type: "MaterialCommunityIcons",
	},
	icon: {
		type: "icon",
		icon: "DiTerminal",
	},
	window: {
		height: 400,
		width: 1000,
		position: { x: 50, y: 50 },
		maxHeight: 900,
		maxWidth: 1200,
		minWidth: 350,
		minHeight: 200,
	},
};

// from https://svaddi.dev/how-to-create-web-based-terminals/;
class PTY {
	shell: string;
	ptyProcess: IPty;
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
			cwd, // Which path should terminal start
		});

		// Add a "data" event listener.
		this.ptyProcess.on("data", (data) => {
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
