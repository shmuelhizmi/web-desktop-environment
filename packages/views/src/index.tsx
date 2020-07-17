import React from "react";
import ReactDOM from "react-dom";
import { Transports } from "@mcesystems/reflow";
import { renderDisplayLayer } from "@mcesystems/reflow-react-display-layer";
import Login from "./loginScreen/Login";
import "./index.css";
import * as views from "./views";
import "typeface-jetbrains-mono";
import { ThemeProvider } from "@material-ui/styles";
import { defaultTheme } from "./theme";

class ReflowConnectionManager {
  host: string;
  constructor(host: string) {
    this.host = host;
  }
  connect = (port: number, mountPoint: Element) => {
    renderDisplayLayer({
      element: mountPoint,
      transport: new Transports.WebSocketsTransport({ port, host: this.host }),
      views,
    });
  };
}

export let reflowConnectionManager: ReflowConnectionManager;

export const connectToServer = (host: string, port: number) => {
  reflowConnectionManager = new ReflowConnectionManager(host);

  const app = document.getElementById("root");
  if (app) {
    reflowConnectionManager.connect(port, app);
  }
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={defaultTheme}>
      <Login onLogin={connectToServer} />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
