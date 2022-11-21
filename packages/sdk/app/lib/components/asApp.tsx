import React from "react";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import API from "@web-desktop-environment/server-api";
import { App } from "../appManager";
import { LoggingManager } from "@web-desktop-environment/server-api/lib/frontend/managers/logging/loggingManager";
import AppBase from "./appBase";
import { ViewsToServerComponents } from "@react-fullstack/fullstack/server";

export type AppFunctionComponent<
	Input extends object,
	PropsForRunningAsChildApp extends object = {},
	Views extends ViewInterfacesType = ViewInterfacesType
> = (
	props: AppFunctionComponentProps<Input, PropsForRunningAsChildApp, Views>
) => JSX.Element;

export type AppFunctionComponentProps<
	Input extends object,
	PropsForRunningAsChildApp extends object = {},
	Views extends ViewInterfacesType = ViewInterfacesType
> = {
	input: Input;
	logger: LoggingManager;
	views: ViewsToServerComponents<Views>;
	api: typeof API;
	/**
	 * only available if running as a child app
	 */
	internalProps?: PropsForRunningAsChildApp;
	/**
	 * only available if running as standalone app
	 */
	close?(): void;
	/**
	 * only available if running as standalone app
	 */
	appData?: Omit<App<Input>, "App" | "defaultInput">;
	children?: React.ReactNode;
};

type AsApp = <
	Input extends object,
	PropsForRunningAsChildApp extends object = {},
	Views extends ViewInterfacesType = ViewInterfacesType
>(
	AppComponent: AppFunctionComponent<Input, PropsForRunningAsChildApp, Views>,
	name: string
) => new () => AppBase<Input, {}, PropsForRunningAsChildApp>;

export const asApp: AsApp = (AppComponent, name) => {
	const app = class APP extends AppBase<any, any, any> {
		name = name;
		renderApp = (views) => {
			const { props, api, logger } = this;
			const {
				input,
				propsForRunningAsChildApp,
				propsForRunningAsSelfContainedApp,
				children,
			} = props;
			return (
				<AppComponent
					input={input}
					logger={logger}
					appData={propsForRunningAsSelfContainedApp.appData}
					close={propsForRunningAsSelfContainedApp.close}
					internalProps={propsForRunningAsChildApp}
					api={api}
					views={views}
				>
					{children}
				</AppComponent>
			);
		};
	};
	return app as any;
};
