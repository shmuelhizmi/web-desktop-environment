import * as React from "react";
import ReactDOM from "react-dom";
import Login, { loginStorage } from "@root/loginScreen/Login";
import Demo from "@root/demo/App";
import "@root/index.css";
import * as webViews from "@root/views";
import * as webViewsWindow from "@root/views/windowViews";
import * as nativeViewsHost from "@root/views/native/hostViews";
import * as nativeViewsClient from "@root/views/native/clientViews";
import * as serviceViews from "@root/views/services";
import "typeface-jetbrains-mono";
import { defaultTheme } from "@root/theme";
import { ThemeProvider as TP } from "@material-ui/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ConnectionContext } from "./contexts";
import { Client } from "@react-fullstack/fullstack-socket-client";
import StateComponent from "@components/stateComponent";
import setUpDocument from "@utils/setupDocument";
import "@web-desktop-environment/interfaces/lib/web/sdk";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.react = React;

type Views =
	| "web"
	| "webWindow"
	| "nativeHost"
	| "nativeClient"
	| "serviceViews";

const viewsMap = {
	web: webViews,
	nativeHost: nativeViewsHost,
	nativeClient: nativeViewsClient,
	webWindow: webViewsWindow,
	serviceViews,
};

class ReactFullstackConnectionManager {
	public readonly host: string;
	public readonly https: boolean;
	public readonly mainPort: number;
	public readonly token: string;
	constructor(
		host: string,
		https: boolean,
		mainPort: number,
		token: string = loginStorage.token
	) {
		this.host = host;
		this.https = https;
		this.mainPort = mainPort;
		this.token = token;
	}
	connect = <V extends Views>(
		domain: string,
		views: V
	): {
		port: number;
		host: string;
		views: typeof viewsMap[V];
		socketOptions: SocketIOClient.ConnectOpts;
	} => {
		return {
			host: `${this.https ? "https" : "http"}://${this.host}`,
			port: this.mainPort,
			views: { ...viewsMap[views] },
			socketOptions: {
				transports: ["websocket"],
				path: `/${domain}/${this.token}/socket.io`,
			},
		};
	};
}

export let reactFullstackConnectionManager: ReactFullstackConnectionManager;

export const connectToServer = (
	host: string,
	useHttps: boolean,
	port: number,
	views: Views
) => {
	reactFullstackConnectionManager = new ReactFullstackConnectionManager(
		host,
		useHttps,
		port
	);
	return reactFullstackConnectionManager.connect("desktop", views);
};

window.wdeSdk = {
	get host() {
		return reactFullstackConnectionManager.host;
	},
	get https() {
		return reactFullstackConnectionManager.https;
	},
	get token() {
		return reactFullstackConnectionManager.token;
	},
	get port() {
		return reactFullstackConnectionManager.mainPort;
	},
};

const App = () => {
	const [login, setLogin] = React.useState<{
		isLoggedIn: boolean;
		host: string;
		port: number;
		https: boolean;
	}>({ host: "localhost", port: 5000, isLoggedIn: false, https: false });
	return (
		<TP theme={defaultTheme}>
			<Router>
				<Switch>
					<Route path="/demo">{() => <Demo />}</Route>
					<Route>
						<Switch>
							<Route path="/connect/link/:id">
								{(login) => {
									const { id } = login.match?.params || {};
									if (!id) {
										return null;
									}
									const data = JSON.parse(atob(id));
									if (!data) {
										return null;
									}
									loginStorage.token = data.token;
									return (
										<ConnectionContext.Provider
											value={{ host: data.host, port: data.port }}
										>
											<Client<{}>
												{...connectToServer(
													data.host,
													data.https,
													data.port,
													"web"
												)}
											/>
										</ConnectionContext.Provider>
									);
								}}
							</Route>
							<Route>
								{() =>
									login.isLoggedIn ? (
										<ConnectionContext.Provider value={login}>
											<Client<{}>
												{...connectToServer(
													login.host,
													login.https,
													Number(login.port),
													"web"
												)}
											/>
										</ConnectionContext.Provider>
									) : (
										<Login
											onLogin={(host, port, https) =>
												setLogin({ host, port, isLoggedIn: true, https })
											}
										/>
									)
								}
							</Route>
						</Switch>
					</Route>
				</Switch>
			</Router>
		</TP>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));

setUpDocument();

if (location.host.includes("githubpreview")) {
	// prevent hot reload with alert
	window.onbeforeunload = () => {
		alert("Are you sure you want to leave?");
		return false;
	};
}
