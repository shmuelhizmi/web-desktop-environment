import React from "react";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewsToServerComponents } from "@react-fullstack/fullstack/lib/Views";
import API from "@web-desktop-environment/server-api";
import Window from "./window";
import { App } from "../appManger";

export interface AppBaseProps<Input>
	extends Omit<App<Input>, "App" | "defaultInput"> {
	close(): void;
	input: Input;
}

export interface AppBaseState {
	useDefaultWindow: boolean;
	defaultWindowTitle?: string;
}

abstract class AppBase<
	Input extends object,
	State extends AppBaseState
> extends React.Component<AppBaseProps<Input>, State> {
	protected api = API;
	abstract renderApp(
		views: ViewsToServerComponents<ViewInterfacesType>
	): JSX.Element | JSX.Element[];
	render() {
		const { useDefaultWindow, defaultWindowTitle } = this.state;
		const { close, icon, name, window } = this.props;
		return (
			<ViewsProvider<ViewInterfacesType>>
				{(views) => (
					<>
						{useDefaultWindow ? (
							<Window
								icon={icon}
								name={name}
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
