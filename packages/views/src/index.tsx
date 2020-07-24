import React from "react";
import ReactDOM from "react-dom";
import { Transports } from "@mcesystems/reflow";
import { renderDisplayLayer } from "@mcesystems/reflow-react-display-layer";
import Login from "@root/loginScreen/Login";
import "@root/index.css";
import * as views from "@root/views";
import "typeface-jetbrains-mono";
import { defaultTheme } from "@root/theme";
import { ThemeType } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { ThemeProvider as TP } from "@material-ui/styles";
import ThemeProvider from "@components/themeProvider";

class ReflowConnectionManager {
	host: string;
	constructor(host: string) {
		this.host = host;
	}
	connect = (port: number, mountPoint?: Element) => {
		const transport = new Transports.WebSocketsTransport<{
			theme?: ThemeType;
		}>({
			port,
			host: this.host,
		});
		if (mountPoint) {
			renderDisplayLayer({
				element: mountPoint,
				transport,
				views,
				wrapper: ThemeProvider,
			});
		}
		return { transport, views };
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
		<TP theme={defaultTheme}>
			<Login onLogin={connectToServer} />
		</TP>
	</React.StrictMode>,
	document.getElementById("root")
);
