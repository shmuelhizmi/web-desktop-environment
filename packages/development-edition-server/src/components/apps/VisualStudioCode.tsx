import React from "react";
import Component from "@web-desktop-environment/server-sdk/lib/components/base/Component";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { App } from "@web-desktop-environment/server-sdk/lib/components/apps";
import { homedir } from "os";
import { AuthType, DefaultedArgs } from "code-server/out/node/cli";
import * as cp from "child_process";
import { CliMessage } from "code-server/lib/vscode/src/vs/server/ipc";

export const runVsCodeCli = (args: DefaultedArgs): void => {
  const vscode = cp.fork("src/utils/runCode.js", [], {
    env: {
      ...process.env,
      CODE_SERVER_PARENT_PID: process.pid.toString(),
    },
  });
  vscode.once("message", (message: any) => {
    if (message.type !== "ready") {
      process.exit(1);
    }
    const send: CliMessage = { type: "cli", args };
    vscode.send(send);
  });
  vscode.once("error", () => {
    process.exit(1);
  });
};

interface VSCodeInput {
  process?: string;
  args?: string[];
  location?: string;
}

interface VSCodeState {
  port?: number;
}

export const vscodeDir = ".web-desktop-environment-vscode";
export const vscodeExtensionDir = ".web-desktop-environment-vscode";

class VSCode extends Component<VSCodeInput, VSCodeState> {
  name = "vscode";
  state: VSCodeState = {};

  componentDidMount = () => {
    this.desktopManager.portManager.getPort().then((port) => {
      this.setState({ port });
      runVsCodeCli({
        port,
        "extensions-dir": "",
        "proxy-domain": [],
        "user-data-dir": "",
        _: [],
        auth: AuthType.None,
        config: "",
        host: "127.0.0.1",
        usingEnvHashedPassword: false,
        usingEnvPassword: false,
        verbose: false,
      });
    });
  };

  renderComponent() {
    const { port } = this.state;
    return (
      <ViewsProvider<ViewInterfacesType>>
        {({ Iframe }) => port && <Iframe port={port} />}
      </ViewsProvider>
    );
  }
}

export const vscode: App<VSCodeInput> = {
  name: "VS-Code",
  description: "full vscode editor",
  App: VSCode,
  defaultInput: { location: homedir() },
  nativeIcon: {
    icon: "console",
    type: "MaterialCommunityIcons",
  },
  icon: {
    type: "icon",
    icon: "VscCode",
  },
  window: {
    height: 900,
    width: 1500,
    position: { x: 50, y: 50 },
    maxHeight: 100000,
    maxWidth: 100000,
    minWidth: 500,
    minHeight: 500,
  },
};
