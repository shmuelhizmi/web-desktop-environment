import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Transports } from "@mcesystems/reflow";
import {
	renderDisplayLayer,
	ReflowDisplayLayerElement,
} from "@mcesystems/reflow-react-display-layer";
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

type Views = "web" | "nativeHost" | "nativeClient";

const viewsMap = {
	web: webViews,
	nativeHost: nativeViewsHost,
	nativeClient: nativeViewsClient,
};

class ReflowConnectionManager {
	public readonly host: string;
	public readonly views: Views;
	constructor(host: string, views: Views) {
		this.host = host;
		this.views = views;
	}
	connect = (port: number, mountPoint?: Element) => {
		const transport = new Transports.WebSocketsTransport<{
			theme?: ThemeType;
			customTheme?: Theme;
		}>({
			port,
			host: this.host,
		});
		if (mountPoint) {
			renderDisplayLayer({
				element: mountPoint,
				transport,
				views: viewsMap[this.views],
				wrapper: ThemeProvider,
			});
		}
		return { transport, views: viewsMap[this.views] };
	};
}

export let reflowConnectionManager: ReflowConnectionManager;

export const connectToServer = (host: string, port: number, views: Views) => {
	reflowConnectionManager = new ReflowConnectionManager(host, views);
	return reflowConnectionManager.connect(port);
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
								<Route path="/native/connect/:host/:port/">
									{(login) => {
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
								</Route>
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
