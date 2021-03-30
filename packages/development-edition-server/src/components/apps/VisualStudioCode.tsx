import React from "react";
import Component from "@web-desktop-environment/server-sdk/lib/components/base/Component";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { App } from "@web-desktop-environment/server-sdk/lib/components/apps";
import { homedir } from "os";
import * as cp from "child_process";
import axios from 'axios'

interface VSCodeInput {
  process?: string;
  args?: string[];
  location?: string;
}

interface VSCodeState {
  port?: number;
  isLoaded: boolean;
}

class VSCode extends Component<VSCodeInput, VSCodeState> {
  name = "vscode";
  state: VSCodeState = {
    isLoaded: false,
  };

  vscode: cp.ChildProcessWithoutNullStreams;

  willUnmount = false;

  runVsCodeCli = (port: number): void => {
    this.vscode = cp.spawn("code-server", [`--port=${port}`, `--auth=none`]);
    const waitForVscodeToLoad = () => {
      if (!this.willUnmount) {
        axios.get("http://localhost:" + port).then(() => !this.willUnmount && this.setState({ isLoaded: true })).catch(() => {
          setTimeout(() => waitForVscodeToLoad(), 250);
        })
      }
    }
    waitForVscodeToLoad();
  };

  componentWillUnmount = () => {
    this.willUnmount = true;
    this.vscode.kill();
  }

  componentDidMount = () => {
    this.desktopManager.portManager.getPort().then((port) => {
      this.setState({ port });
      this.runVsCodeCli(port);
    });
  };

  renderComponent() {
    const { port, isLoaded } = this.state;
    return (
      <ViewsProvider<ViewInterfacesType>>
        {({ Iframe, LoadingScreen }) =>
          port && isLoaded ? (
            <Iframe port={port} />
          ) : (
            <LoadingScreen message={"loading vs-code"} variant="jumpCube" />
          )
        }
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
    height: 700,
    width: 1000,
    position: { x: 50, y: 50 },
    maxHeight: 7000,
    maxWidth: 7000,
    minWidth: 500,
    minHeight: 500,
    allowLocalScreenSnapping: true,
  },
};
