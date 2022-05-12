import React from "react";
import { Icon } from "@web-desktop-environment/interfaces/lib/shared/icon";
import { Component } from "react";
import { AppBaseProps } from "./components/appBase";
import { Render } from "@react-fullstack/render";
import { Server } from "@react-fullstack/fullstack-socket-server";
import { Views } from "@react-fullstack/fullstack";
import API from "@web-desktop-environment/server-api";
import { Window } from "@web-desktop-environment/interfaces/lib/shared/window";
import { viewInterfaces } from "@web-desktop-environment/interfaces/lib";

export interface App<Input> {
	icon: Icon;
	name: string;
	displayName: string;
	defaultInput: Input;
	description: string;
	color?: string;
	window: Window;
	App: new (props: Input & AppBaseProps<Input, {}>) => Component<
		Input & AppBaseProps<Input, {}>
	>;
}

export class AppsManager {
	private static logger = API.loggingManager.mount("apps_manager");

	private static registeredApps = new Map<string, Omit<App<unknown>, "name">>();

	public static registerApp(
		apps: Record<string, Omit<App<unknown>, "name">>,
		views: Views = viewInterfaces
	) {
		for (const appName in apps) {
			const {
				description,
				icon,
				displayName,
				App,
				defaultInput,
				window,
				color,
			} = apps[appName];
			AppsManager.registeredApps.set(appName, apps[appName]);
			API.appsManager.registerApp(
				{ description, displayName, icon, name: appName },
				async (port, input, awaitClose, close) => {
					const { stop } = Render(
						<Server singleInstance port={port} views={views}>
							{() => (
								<App
									propsForRunningAsSelfContainedApp={{
										close,
										appData: {
											description,
											displayName,
											color,
											icon,
											name: appName,
											window,
										},
									}}
									input={{ ...(defaultInput as object), ...input }}
									parentLogger={this.logger}
								/>
							)}
						</Server>
					);
					awaitClose.then(() => stop());
				}
			);
		}
	}

	public static get apps() {
		return new Map(AppsManager.registeredApps);
	}
}
