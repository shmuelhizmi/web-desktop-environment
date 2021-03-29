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
import { Client } from "@react-fullstack/fullstack-socket-client";
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
	public readonly host: string;
	constructor(host: string) {
		this.host = host;
	}
	connect = <V extends Views>(
		port: number,
		views: V
	): {
		port: number;
		host: string;
		views: typeof viewsMap[V];
		socketOptions: SocketIOClient.ConnectOpts;
	} => {
		return {
			host: this.host,
			port,
			views: { ...viewsMap[views] },
			socketOptions: {
				transports: ["websocket"],
			},
		};
	};
}

export let reactFullstackConnectionManager: ReactFullstackConnectionManager;

export const connectToServer = (host: string, port: number, views: Views) => {
	reactFullstackConnectionManager = new ReactFullstackConnectionManager(host);
	return reactFullstackConnectionManager.connect(port, views);
};

const App = () => {
	const [login, setLogin] = useState<{
		isLoggedIn: boolean;
		host: string;
		port: number;
	}>({ host: "localhost", port: 5000, isLoggedIn: false });
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
													Number(login.port),
													"nativeHost"
												)}
											/>
										</ConnectionContext.Provider>
									) : (
										<Login
											onLogin={(host, port) =>
												setLogin({ host, port, isLoggedIn: true })
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
													{...connectToServer(host, Number(port), "web")}
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
													Number(login.port),
													"web"
												)}
											/>
										</ConnectionContext.Provider>
									) : (
										<Login
											onLogin={(host, port) =>
												setLogin({ host, port, isLoggedIn: true })
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
