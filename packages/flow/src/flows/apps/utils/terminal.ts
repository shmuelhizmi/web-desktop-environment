import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { apps, App } from "..";
import { portManager } from "../../shared/utils/checkPort";
import * as socket from "socket.io";
import * as http from "http";
import { spawn } from "child_process";

interface TerminalInput {
  process?: string;
}

const terminalFlow = <Flow<ViewInterfacesType, TerminalInput>>(async ({
  view,
  views,
  event,
  input: { process = "cmd" },
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
  terminal.stdin.write("ipconfig\n")
  const port = await portManager.getPort();
  server.listen(port);
  socketServer.on("connection", (client) => {
    client.emit("out", history);
    client.on("in", (data) => {
      terminal.stdin.write(data + "\n");
    });
  });
  const window = view(0, views.terminal, {
    port,
  });

  await window;
});

export const terminal: App = {
  name: "Termial",
  description: "a terminal window",
  flow: terminalFlow,
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
