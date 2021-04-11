import React from "react";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { Window as WindowViewState } from "@web-desktop-environment/interfaces/lib/shared/window";
import {
	ThemeType,
	Theme,
} from "@web-desktop-environment/interfaces/lib/shared/settings";
import API from "@web-desktop-environment/server-api";
import { Window as WindowProperties } from "@web-desktop-environment/interfaces/src/shared/window";
import { Icon } from "@root/../../../shared/interfaces/lib/shared/icon";

export interface WindowInput {
	close(): void;
	title: string;
	name: string;
	icon: Icon;
	windowProperties: WindowProperties;
	children: JSX.Element | JSX.Element[];
}

interface WindowState {
	theme?: ThemeType;
	customTheme?: Theme;
	window: WindowViewState;
	background?: string;
}

class Window extends React.Component<WindowInput, WindowState> {
	name = "window";
	state: WindowState = {
		window: { ...this.props.windowProperties },
	};
	onComponentWillUnmount: Function[] = [];
	componentDidMount = () => {
		const listenToNewSettings = API.settingsManager.onNewSettings(
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
	componentWillUnmount = () => this.onComponentWillUnmount.forEach((f) => f());
	render() {
		const { customTheme, theme, background, window } = this.state;
		if (!theme && !background) {
			return <></>;
		}
		const { close, title, children, icon, name } = this.props;
		return (
			<ViewsProvider<ViewInterfacesType>>
				{({ Window, ThemeProvider }) => (
					<ThemeProvider theme={theme} customTheme={customTheme}>
						<Window
							name={name}
							icon={icon}
							title={title}
							window={window}
							background={background}
							setWindowState={(updatedWindow) => {
								this.setState((state) => {
									return {
										window: {
											...state.window,
											position: updatedWindow.position || state.window.position,
											...updatedWindow.size,
										},
									};
								});
							}}
							onClose={close}
						>
							{children}
						</Window>
					</ThemeProvider>
				)}
			</ViewsProvider>
		);
	}
}
export default Window;
