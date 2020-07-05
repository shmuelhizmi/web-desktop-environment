import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { apps, App } from "..";
import { portManager } from "../../shared/utils/checkPort";
import * as socket from "socket.io";
import * as http from "http";
import { Key } from "ts-keycode-enum";
import { getOS, OS } from "../../shared/utils/getOS";
import { tmpdir } from "os";
import { spawn, IPty } from "node-pty";

interface TerminalInput {
  process?: string;
  args?: string[];
  location?: string;
  linesToWriteToProcess?: string[];
}

const terminalFlow = <Flow<ViewInterfacesType, TerminalInput>>(async ({
  view,
  views,
  event,
  input: { process, args, location: cwd, linesToWriteToProcess = [] },
}) => {
  const server = http.createServer();
  const socketServer = socket.listen(server);
  const port = await portManager.getPort();
  server.listen(port);
  let history = "";
  const ptyProcces = new PTY(
    (data) => {
      history += data;
      socketServer.emit("output", data);
    },
    process,
    cwd
  );
  socketServer.on("connection", (client) => {
    socketServer.emit("output", history);
    client.on("input", (data: string) => {
      ptyProcces.write(data);
    });
  });
  const window = view(0, views.terminal, {
    port,
  });

  await window;
});

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

// from https://svaddi.dev/how-to-create-web-based-terminals/;

export const terminal: App<TerminalInput> = {
  name: "Termial",
  description: "a terminal window",
  flow: terminalFlow,
  defaultInput: { process: getDefaultBash(), args: ["-i"], location: tmpdir() },
  icon: {
    type: "fluentui",
    icon: "CommandPrompt",
  },
  window: {
    height: 400,
    width: 1000,
    position: { x: 50, y: 50 },
  },
};

class PTY {
  shell: string;
  ptyProcess: IPty;
  out: (data: string) => void;
  constructor(out: (data) => void, shell: string, cwd: string) {
    // Setting default terminals based on user os
    this.shell = shell;
    this.ptyProcess = null;
    this.out = out;

    // Initialize PTY process.
    this.startPtyProcess(cwd);
  }

  /**
   * Spawn an instance of pty with a selected shell.
   */
  startPtyProcess(cwd: string) {
    this.ptyProcess = spawn(this.shell, [], {
      name: "xterm-color",
      cwd, // Which path should terminal start
    });

    // Add a "data" event listener.
    this.ptyProcess.on("data", (data) => {
      // Whenever terminal generates any data, send that output to socket.io client
      this.sendToClient(data);
    });
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
