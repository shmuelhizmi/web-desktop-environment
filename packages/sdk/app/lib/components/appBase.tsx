import React from "react";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { ViewsProvider } from "@react-fullstack/fullstack/server";
import { ViewsToServerComponents } from "@react-fullstack/fullstack/server";
import API from "@web-desktop-environment/server-api";
import Window from "./window";
import { App } from "../appManager";
import { LoggingManager } from "@web-desktop-environment/server-api/lib/frontend/managers/logging/loggingManager";

export interface AppBaseProps<Input, PropsForRunningAsChildApp> {
	input: Input;
	parentLogger: LoggingManager;
	propsForRunningAsChildApp?: PropsForRunningAsChildApp;
	propsForRunningAsSelfContainedApp?: {
		close(): void;
		appData: Omit<App<Input>, "App" | "defaultInput">;
	};
}

export interface AppBaseState {
	useDefaultWindow: boolean;
	windowTitle?: string;
}

abstract class AppBase<
	Input extends object,
	State extends object,
	PropsForRunningAsChildApp extends object = {}
> extends React.Component<
	AppBaseProps<Input, PropsForRunningAsChildApp>,
	State & AppBaseState
> {
	protected api = API;
	private _logger: LoggingManager;
	abstract name: string;
	protected get logger() {
		if (!this._logger) {
			this._logger = this.props.parentLogger.mount(this.name);
		}
		return this._logger;
	}
	abstract renderApp: (
		views: ViewsToServerComponents<ViewInterfacesType>
	) => JSX.Element | JSX.Element[];
	render() {
		const { useDefaultWindow, windowTitle: defaultWindowTitle } = this.state;
		const { propsForRunningAsSelfContainedApp } = this.props;
		const { icon, name, window, color } =
			propsForRunningAsSelfContainedApp?.appData || {};
		const { close } = propsForRunningAsSelfContainedApp || {};
		return (
			<ViewsProvider<ViewInterfacesType>>
				{(views) => (
					<>
						{useDefaultWindow && propsForRunningAsSelfContainedApp ? (
							<Window
								icon={icon}
								name={name}
								color={color}
								title={defaultWindowTitle}
								windowProperties={window}
								close={close}
							>
								{this.renderApp(views)}
							</Window>
						) : (
							this.renderApp(views)
						)}
					</>
				)}
			</ViewsProvider>
		);
	}
}

export default AppBase;
