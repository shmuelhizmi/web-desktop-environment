import React, { useState } from "react";
import ReactDOM from "react-dom";
import Login from "@root/loginScreen/Login";
import Demo from "@root/demo/App";
import "@root/index.css";
import * as webViews from "@root/views";
import * as webViewsWindow from "@root/views/windowViews";
import * as nativeViewsHost from "@root/views/native/hostViews";
import * as nativeViewsClient from "@root/views/native/clientViews";
import "typeface-jetbrains-mono";
import { defaultTheme } from "@root/theme";
import { ThemeProvider as TP } from "@material-ui/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ConnectionContext } from "./contexts";
import Client from "@components/client";
import StateComponent from "@components/stateComponent";
import setUpDocument from "@utils/setupDocument";

type Views = "web" | "webWindow" | "nativeHost" | "nativeClient";

const viewsMap = {
	web: webViews,
	nativeHost: nativeViewsHost,
	nativeClient: nativeViewsClient,
	webWindow: webViewsWindow,
};

class ReactFullstackConnectionManager {
	constructor(
		public readonly host: string,
		public readonly https: boolean,
		public readonly mainPort: number,
		public readonly token: string
	) {}
	connect = <V extends Views>(
		port: number,
		views: V,
		desktop = false
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
				path: desktop
					? `/desktop/${this.token}/socket.io`
					: `/app/${port}/${this.token}/socket.io`,
			},
		};
	};
}

export let reactFullstackConnectionManager: ReactFullstackConnectionManager;

export const connectToServer = (
	host: string,
	useHttps: boolean,
	port: number,
	views: Views,
	token = localStorage.getItem("last_session_token")
) => {
	if (token) {
		localStorage.setItem("last_session_token", token);
		reactFullstackConnectionManager = new ReactFullstackConnectionManager(
			host,
			useHttps,
			port,
			token
		);
		return {
			...reactFullstackConnectionManager.connect(port, views, true),
			missingToken: false as const,
		};
	}
	return { missingToken: true as const };
};

const App = () => {
	const [login, setLogin] = useState<{
		isLoggedIn: boolean;
		host: string;
		port: number;
		https: boolean;
		token: string;
	}>({
		host: "localhost",
		port: 5000,
		isLoggedIn: false,
		https: false,
		token: "",
	});
	return (
		<TP theme={defaultTheme}>
			<Router>
				<Switch>
					<Route path="/demo">{() => <Demo />}</Route>
					<Route path="/native">
						<Switch>
							<Route
								path="/native/connect/:host/:port/"
								render={(login) => {
									const { host, port } = login.match?.params;
									return (
										<StateComponent<{}> defaultState={{}}>
											{() => (
												<ConnectionContext.Provider
													value={{ host, port: Number(port) }}
												>
													<Client<{}>
														{...connectToServer(
															host,
															false,
															Number(port),
															"nativeHost"
														)}
													/>
												</ConnectionContext.Provider>
											)}
										</StateComponent>
									);
								}}
							></Route>
							<Route path="/native/client/connect/:host/:port/">
								{(login) => {
									const { host, port } = login.match?.params || {};

									if (host && port) {
										return (
											<ConnectionContext.Provider
												value={{ host, port: Number(port) }}
											>
												<Client<{}>
													{...connectToServer(
														host,
														false,
														Number(port),
														"nativeClient"
													)}
												/>
											</ConnectionContext.Provider>
										);
									}
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
													"nativeHost",
													login.token
												)}
											/>
										</ConnectionContext.Provider>
									) : (
										<Login
											onLogin={(host, port, https, token) =>
												setLogin({ host, port, isLoggedIn: true, https, token })
											}
										/>
									)
								}
							</Route>
						</Switch>
					</Route>
					<Route>
						<Switch>
							<Route path="/connect/:host/:port/">
								{(login) => {
									const { host, port } = login.match?.params || {};
									if (host && port) {
										return (
											<ConnectionContext.Provider
												value={{ host, port: Number(port) }}
											>
												<Client<{}>
													{...connectToServer(host, false, Number(port), "web")}
												/>
											</ConnectionContext.Provider>
										);
									}
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
													"web",
													login.token
												)}
											/>
										</ConnectionContext.Provider>
									) : (
										<Login
											onLogin={(host, port, https, token) =>
												setLogin({ host, port, isLoggedIn: true, https, token })
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
