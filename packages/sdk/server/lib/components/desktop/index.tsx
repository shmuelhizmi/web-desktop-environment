import React from "react";
import Component from "../base/Component";
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
import { GTKBridge as GTKBridgeConnector } from "../../utils/gtkBridge";

interface DesktopState {
	background: string;
	nativeBackground: string;
	openApps: OpenApp[];
	servicesAppsDomains: string[];
	theme: ThemeType;
	customTheme: Theme;
	gtkBridgeConnection?: GTKBridge;
	externalViewsImportPaths: string[];
	externalViewsHostDomain?: string;
}

class Desktop extends Component<{}, DesktopState> {
	name = "desktop";
	get openApps() {
		return this.desktopManager.appsManager.runningApps.map((app) => ({
			icon: app.icon,
			id: app.id,
			name: app.name,
			port: app.port,
		}));
	}
	get servicesAppsDomains() {
		return this.desktopManager.appsManager.servicesApps.map(
			(app) => app.domain
		);
	}
	state: DesktopState = {
		background: this.desktopManager.settingsManager.settings.desktop.background,
		nativeBackground:
			this.desktopManager.settingsManager.settings.desktop.nativeBackground,
		openApps: this.openApps,
		servicesAppsDomains: this.servicesAppsDomains,
		theme: this.desktopManager.settingsManager.settings.desktop.theme,
		customTheme:
			this.desktopManager.settingsManager.settings.desktop.customTheme,
		externalViewsImportPaths: [],
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
		this.desktopManager.appsManager.on("onOpenAppsUpdate", () => {
			this.setState({
				openApps: this.openApps,
			});
		});
		this.desktopManager.appsManager.on("onServiceAppLaunch", () => {
			this.setState({
				servicesAppsDomains: this.servicesAppsDomains,
			});
		});
		this.desktopManager.appsManager.on("onInstalledAppsUpdate", () => {
			this.forceUpdate();
		});
		this.initializeDesktop();
		this.desktopManager.packageManager
			.packagesWebHostingServer()
			.then(({ domain }) => {
				this.setState({
					externalViewsHostDomain: domain,
					externalViewsImportPaths:
						this.desktopManager.packageManager.packagesViewsImportPaths,
				});
			});
	};
	async initializeDesktop() {
		const connectToGTK = new GTKBridgeConnector(
			this.logger,
			this.desktopManager
		);
		const connection = await connectToGTK.initialize();
		if (connection.success) {
			this.setState({ gtkBridgeConnection: { domain: connection.domain } });
		}
	}
	launchApp: DesktopProps["onLaunchApp"] = async (app) => {
		this.logger.info(`launch app ${app.name}`);
		this.desktopManager.appsManager.spawnApp(app.name, app.params);
	};
	closeApp: DesktopProps["onCloseApp"] = async (id) => {
		this.logger.info(
			`closing app appName ${
				this.desktopManager.appsManager.runningApps.find((app) => app.id === id)
					.name
			}`
		);
		this.desktopManager.appsManager.killApp(id);
	};
	renderComponent() {
		const appsProp = this.desktopManager.appsManager.apps.map((app) => {
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
			servicesAppsDomains,
			externalViewsImportPaths,
			externalViewsHostDomain,
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
							servicesAppsDomains={servicesAppsDomains}
							externalViewsHostDomain={externalViewsHostDomain || ""}
							externalViewsImportPaths={externalViewsImportPaths}
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
