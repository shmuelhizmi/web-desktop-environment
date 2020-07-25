import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { App } from "@apps/index";
import * as socket from "socket.io";
import * as http from "http";
import { getOS, OS } from "@utils/getOS";
import { tmpdir } from "os";
import { spawn, IPty } from "node-pty";
import { defaultFlowInput } from "@managers/desktopManager";

interface TerminalInput {
	process?: string;
	args?: string[];
	location?: string;
}

const terminalFlow: Flow<
	ViewInterfacesType,
	TerminalInput & defaultFlowInput
> = async ({
	view,
	views,
	onCanceled,
	input: { process, args, location: cwd, desktopManager },
}) => {
	const server = http.createServer();
	const socketServer = socket.listen(server);
	const port = await desktopManager.portManager.getPort();
	server.listen(port);
	let history = "";
	const ptyProcces = new PTY(
		(data) => {
			history += data;
			socketServer.emit("output", data);
		},
		process,
		cwd,
		args
	);
	socketServer.on("connection", (client) => {
		socketServer.emit("output", history);
		client.on("input", (data: string) => {
			ptyProcces.write(data);
		});

		client.on("setColumns", (columns: number) => {
			// fit columns to window size
			ptyProcces.setCols(columns);
		});
	});
	const window = view(0, views.terminal, {
		port,
	});
	onCanceled(() => ptyProcces.exitPtyProcess());
	await window;
};

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
	flow: terminalFlow,
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
		this.ptyProcess.resize(columns, this.ptyProcess.rows);
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

export default terminalFlow;
