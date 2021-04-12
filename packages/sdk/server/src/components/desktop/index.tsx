import React from "react";
import Component from "@component";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import {
	OpenApp,
	GTKBridge,
} from "@web-desktop-environment/interfaces/lib/views/Desktop";
import {
	ThemeType,
	Theme,
} from "@web-desktop-environment/interfaces/lib/shared/settings";
import { Input as DesktopProps } from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { GTKBridge as GTKBridgeConnector } from "@utils/gtkBridge";

interface DesktopState {
	background: string;
	nativeBackground: string;
	openApps: OpenApp[];
	theme: ThemeType;
	customTheme: Theme;
	gtkBridgeConnection?: GTKBridge;
}

class Desktop extends Component<{}, DesktopState> {
	name = "desktop";
	state: DesktopState = {
		background: this.desktopManager.settingsManager.settings.desktop.background,
		nativeBackground: this.desktopManager.settingsManager.settings.desktop
			.nativeBackground,
		openApps: this.desktopManager.windowManager.runningApps.map((app) => ({
			icon: app.icon,
			id: app.id,
			name: app.name,
			port: app.port,
		})),
		theme: this.desktopManager.settingsManager.settings.desktop.theme,
		customTheme: this.desktopManager.settingsManager.settings.desktop
			.customTheme,
	};
	componentDidMount = () => {
		const listenToNewSettings = this.desktopManager.settingsManager.emitter.on(
			"onNewSettings",
			(settings) => {
				this.setState({
					background: settings.desktop.background,
					nativeBackground: settings.desktop.nativeBackground,
					customTheme: settings.desktop.customTheme,
					theme: settings.desktop.theme,
				});
			}
		);
		this.onComponentWillUnmount.push(listenToNewSettings.remove);
		this.desktopManager.windowManager.emitter.on(
			"onOpenAppsUpdate",
			(openApps) => {
				this.setState({
					openApps: openApps.map((app) => ({
						icon: app.icon,
						id: app.id,
						name: app.name,
						port: app.port,
					})),
				});
			}
		);
		this.desktopManager.windowManager.emitter.on(
			"onInstalledAppsUpdate",
			() => {
				this.forceUpdate();
			}
		);
		const connectToGTK = new GTKBridgeConnector(
			this.logger,
			this.desktopManager
		);
		connectToGTK.initialize().then((connection) => {
			if (connection.success) {
				this.setState({ gtkBridgeConnection: { port: connection.port } });
			}
		});
	};
	launchApp: DesktopProps["onLaunchApp"] = async (app) => {
		this.logger.info(`launch app ${app.name}`);
		this.desktopManager.windowManager.spawnApp(app.name, app.params);
	};
	closeApp: DesktopProps["onCloseApp"] = async (id) => {
		this.logger.info(
			`closing app appName ${
				this.desktopManager.windowManager.runningApps.find(
					(app) => app.id === id
				).name
			}`
		);
		this.desktopManager.windowManager.killApp(id);
	};
	renderComponent() {
		const appsProp = this.desktopManager.windowManager.apps.map((app) => {
			const { description, icon, appName, displayName } = app;
			return {
				displayName,
				description,
				icon,
				appName,
			};
		});
		const {
			background,
			nativeBackground,
			openApps,
			customTheme,
			theme,
			gtkBridgeConnection,
		} = this.state;
		return (
			<ViewsProvider<ViewInterfacesType>>
				{({ Desktop: DesktopView, ThemeProvider }) => (
					<ThemeProvider theme={theme} customTheme={customTheme}>
						<DesktopView
							gtkBridge={gtkBridgeConnection}
							apps={appsProp}
							openApps={openApps}
							background={background}
							nativeBackground={nativeBackground}
							onCloseApp={this.closeApp}
							onLaunchApp={this.launchApp}
						>
							{this.props.children}
						</DesktopView>
					</ThemeProvider>
				)}
			</ViewsProvider>
		);
	}
}

export default Desktop;
