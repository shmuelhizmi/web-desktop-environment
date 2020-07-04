import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { apps, App } from "..";
import { portManager } from "../../shared/utils/checkPort";
import * as socket from "socket.io";
import * as http from "http";
import { spawn } from "child_process";
import { Key } from "ts-keycode-enum";
import { getOS, OS } from "../../shared/utils/getOS";
import { platform } from "os";


interface TerminalInput {
  process?: string;
}

const terminalFlow = <Flow<ViewInterfacesType, TerminalInput>>(async ({
  view,
  views,
  event,
  input: { process },
}) => {
  const terminal = spawn(process || "bash");
  const server = http.createServer();
  const socketServer = socket.listen(server);
  let history = "";
  terminal.stdout.on("data", (data) => {
    const out = data.toString();
    socketServer.emit("out", out);
    history +=out;
  });
  terminal.stderr.on("data", (data) => {
    const out = data.toString();
    socketServer.emit("out", out);
    history +=out;
  });
  terminal.on("exit", (data) => {
    const out = "terminal exit with code - ";
    socketServer.emit("out", out);
    history+= out;
  });
  const port = await portManager.getPort();
  server.listen(port);
  socketServer.on("connection", (client) => {
    client.emit("out", history);
    client.on("in", (data) => {
      terminal.stdin.write(data);
    });
    client.on("inkey", (keyCode) => {
      switch (keyCode) {
        case Key.Enter: {
          terminal.stdin.write("\n")
          break;
        }
        case Key.UpArrow: {
          terminal.stdin.write("\u001b[A")
          break;
        }
        case Key.DownArrow: {
          terminal.stdin.write("\u001b[B")
          break;
        }
        case Key.RightArrow: {
          terminal.stdin.write("\u001b[C")
          break;
        }
        case Key.LeftArrow: {
          terminal.stdin.write("\u001b[C")
          break;
        }
        default: {
          terminal.stdin.write(String.fromCharCode(keyCode));
          break;
        }
      }
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
    return "bash"
  }
  if (os === OS.Window) {
    return "cmd"
  }
  if (os === OS.Mac) {
    return "bash"
  }
  if (os === OS.Other) {
    return "bash"
  }
}

export const terminal: App<TerminalInput> = {
  name: "Termial",
  description: "a terminal window",
  flow: terminalFlow,
  defaultInput: { process: getDefaultBash()},
  icon: {
    type: "fluentui",
    icon: "CommandPrompt",
  },
  window: {
    height: 400,
    width: 1000,
  },
};

export default terminalFlow;
