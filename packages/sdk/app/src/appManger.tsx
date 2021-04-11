import React from "react";
import {
	Icon,
	NativeIcon,
} from "@web-desktop-environment/interfaces/lib/shared/icon";
import { Component } from "react";
import { AppBaseProps } from "./components/appBase";
import { Render } from "@react-fullstack/render";
import { Server } from "@react-fullstack/fullstack-socket-server";
import API from "@web-desktop-environment/server-api";
import { Window } from "@web-desktop-environment/interfaces/lib/shared/window";
import { viewInterfaces } from "@web-desktop-environment/interfaces/lib";

export interface App<Input> {
	icon: Icon;
	nativeIcon: NativeIcon;
	name: string;
	displayName: string;
	defaultInput: Input;
	description: string;
	window: Window;
	App: new (props: Input & AppBaseProps<Input>) => Component<
		Input & AppBaseProps<Input>
	>;
}

export class AppsManager {
	private static registeredApps = new Map<string, App<unknown>>();

	public static registerApp(apps: Record<string, App<unknown>>) {
		for (const appName in apps) {
			const {
				description,
				icon,
				name,
				displayName,
				App,
				defaultInput,
				nativeIcon,
				window,
			} = apps[appName];
			AppsManager.registeredApps.set(appName, apps[appName]);
			API.appsManager.registerApp(
				{ description, displayName, icon, name },
				(port, input) => {
					const { stop } = Render(
						<Server singleInstance port={port} views={viewInterfaces}>
							{() => (
								<App
									close={stop}
									description={description}
									displayName={displayName}
									icon={icon}
									input={{ ...(defaultInput as object), ...input }}
									name={name}
									nativeIcon={nativeIcon}
									window={window}
								/>
							)}
						</Server>
					);
				}
			);
		}
	}

	public static get apps() {
		return new Map(AppsManager.registeredApps);
	}
}
