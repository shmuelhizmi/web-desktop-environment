import React from "react";
import ReactDOM from "react-dom";
import { Transports } from "@mcesystems/reflow";
import { renderDisplayLayer } from "@mcesystems/reflow-react-display-layer";
import Login from "./loginScreen/Login";
import * as views from "./views";

const connectToServer = (host: string, port: number) => {
  const transport = new Transports.WebSocketsTransport({ port, host });

  const app = document.getElementById("root");
  if (app) {
    renderDisplayLayer({
      element: app,
      transport,
      views,
    });
  }
};

ReactDOM.render(
  <React.StrictMode>
    <Login onLogin={connectToServer} />
  </React.StrictMode>,
  document.getElementById("root")
);
