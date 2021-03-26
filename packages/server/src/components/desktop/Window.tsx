import React from "react";
import Component from "@component";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { App } from "@apps/index";
import { ProcessIDProvider } from "@managers/windowsManager";
import { Window as WindowViewState } from "@web-desktop-environment/interfaces/lib/shared/window";
import {
	ThemeType,
	Theme,
} from "@web-desktop-environment/interfaces/lib/shared/settings";
import { WindowContext } from "contexts";

export interface WindowInput<
	P extends Record<string, unknown> = Record<string, unknown>,
	T extends App<P> = App<P>
> {
	app: T;
	appParams: P;
}

interface WindowState {
	theme: ThemeType;
	customTheme: Theme;
	window: WindowViewState;
	background: string;
	title: string;
}

class Window extends Component<WindowInput, WindowState> {
	name = "window";
	state: WindowState = {
		theme: this.desktopManager.settingsManager.settings.desktop.theme,
		customTheme: this.desktopManager.settingsManager.settings.desktop
			.customTheme,
		background: this.desktopManager.settingsManager.settings.desktop.background,
		title: this.props.app.name,
		window: { ...this.props.app.window },
	};
	componentDidMount = () => {
		const listenToNewSettings = this.desktopManager.settingsManager.emitter.on(
			"onNewSettings",
			(settings) => {
				this.setState({
					theme: settings.desktop.theme,
					customTheme: settings.desktop.customTheme,
					background: settings.desktop.background,
				});
			}
		);
		this.onComponentWillUnmount.push(listenToNewSettings.remove);
	};
	renderComponent() {
		const { customTheme, theme, background, title, window } = this.state;
		const { app, appParams } = this.props;
		return (
			<ProcessIDProvider.Consumer>
				{(processId) => {
					const closeWindow = () => {
						if (processId !== undefined) {
							this.desktopManager.windowManager.killApp(processId);
						}
					};
					return (
						<ViewsProvider<ViewInterfacesType>>
							{({ Window, ThemeProvider }) => (
								<ThemeProvider theme={theme} customTheme={customTheme}>
									<Window
										name={app.name}
										icon={app.icon}
										title={title}
										window={window}
										background={background}
										setWindowState={(updatedWindow) => {
											this.setState((state) => {
												return {
													window: {
														...state.window,
														position:
															updatedWindow.position || state.window.position,
														...updatedWindow.size,
													},
												};
											});
										}}
										onClose={closeWindow}
									>
										<WindowContext.Provider
											value={{
												setWindowTitle: (title) => this.setState({ title }),
												closeWindow,
											}}
										>
											<app.App {...{ ...app.defaultInput, ...appParams }} />
										</WindowContext.Provider>
									</Window>
								</ThemeProvider>
							)}
						</ViewsProvider>
					);
				}}
			</ProcessIDProvider.Consumer>
		);
	}
}
export default Window;
