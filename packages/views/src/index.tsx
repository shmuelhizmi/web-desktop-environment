import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Transports } from "@web-desktop-environment/reflow";
import Login from "@root/loginScreen/Login";
import "@root/index.css";
import * as webViews from "@root/views";
import * as nativeViewsHost from "@root/views/native/hostViews";
import * as nativeViewsClient from "@root/views/native/clientViews";
import "typeface-jetbrains-mono";
import { defaultTheme } from "@root/theme";
import {
	ThemeType,
	Theme,
} from "@web-desktop-environment/interfaces/lib/shared/settings";
import { ThemeProvider as TP } from "@material-ui/styles";
import ThemeProvider from "@components/themeProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ConnectionContext } from "./contexts";
import { ReflowDisplayLayerElement } from "@components/reflowDisplayLayerElement";

type Views = "web" | "nativeHost" | "nativeClient";

const viewsMap = {
	web: webViews,
	nativeHost: nativeViewsHost,
	nativeClient: nativeViewsClient,
};

class ReflowConnectionManager {
	public readonly host: string;
	constructor(host: string) {
		this.host = host;
	}
	connect = (port: number, views: Views) => {
		const transport = new Transports.WebSocketsTransport<{
			theme?: ThemeType;
			customTheme?: Theme;
		}>({
			port,
			host: this.host,
		});
		return { transport, views: viewsMap[views] };
	};
}

export let reflowConnectionManager: ReflowConnectionManager;

export const connectToServer = (host: string, port: number, views: Views) => {
	reflowConnectionManager = new ReflowConnectionManager(host);
	return reflowConnectionManager.connect(port, views);
};

const App = () => {
	const [login, setLogin] = useState<{
		isLoggedIn: boolean;
		host: string;
		port: number;
	}>({ host: "localhost", port: 5000, isLoggedIn: false });
	return (
		<React.StrictMode>
			<TP theme={defaultTheme}>
				<Router>
					<Switch>
						<Route path="/native">
							<Switch>
								<Route
									path="/native/connect/:host/:port/"
									render={(login) => {
										const { host, port } = login.match?.params;
										return (
											<ConnectionContext.Provider value={{ host, port }}>
												<ReflowDisplayLayerElement
													{...connectToServer(host, Number(port), "nativeHost")}
													wrapper={ThemeProvider}
												/>
											</ConnectionContext.Provider>
										);
									}}
								></Route>
								<Route path="/native/client/connect/:host/:port/">
									{(login) => {
										const { host, port } = login.match?.params;
										return (
											<ConnectionContext.Provider value={{ host, port }}>
												<ReflowDisplayLayerElement
													{...connectToServer(
														host,
														Number(port),
														"nativeClient"
													)}
													wrapper={ThemeProvider}
												/>
											</ConnectionContext.Provider>
										);
									}}
								</Route>
								<Route>
									{() =>
										login.isLoggedIn ? (
											<ConnectionContext.Provider value={login}>
												<ReflowDisplayLayerElement
													{...connectToServer(
														login.host,
														Number(login.port),
														"nativeHost"
													)}
													wrapper={ThemeProvider}
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
										const { host, port } = login.match?.params;
										return (
											<ConnectionContext.Provider value={{ host, port }}>
												<ReflowDisplayLayerElement
													{...connectToServer(host, Number(port), "web")}
													wrapper={ThemeProvider}
												/>
											</ConnectionContext.Provider>
										);
									}}
								</Route>
								<Route>
									{() =>
										login.isLoggedIn ? (
											<ConnectionContext.Provider value={login}>
												<ReflowDisplayLayerElement
													{...connectToServer(
														login.host,
														Number(login.port),
														"web"
													)}
													wrapper={ThemeProvider}
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
		</React.StrictMode>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
