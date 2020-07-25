import React from "react";
import {
	ReflowReactComponent,
	ReflowDisplayLayerElement,
} from "@mcesystems/reflow-react-display-layer";
import DesktopInterface, {
	App,
	OpenApp,
} from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "@layoutComponents/Home";
import AppView from "@layoutComponents/AppView";

interface DesktopContextInterface {
	openApps: OpenApp[];
	apps: App[];
	currentApp?: OpenApp;
	setCurrentApp: (currentApp: OpenApp) => void;
}

export const DesktopContext = React.createContext<DesktopContextInterface>({
	apps: [],
	openApps: [],
	setCurrentApp: () => {
		/* */
	},
});

interface DesktopState {
	currentApp?: OpenApp;
}

class Desktop extends ReflowReactComponent<DesktopInterface, {}, DesktopState> {
	state: DesktopState = {};

	stack = createStackNavigator();

	render() {
		const { currentApp } = this.state;
		const { apps, openApps } = this.props;
		return (
			<DesktopContext.Provider
				value={{
					openApps: openApps,
					apps: apps,
					currentApp: currentApp,
					setCurrentApp: (newCurrentApp) =>
						this.setState({ currentApp: newCurrentApp }),
				}}
			>
				<NavigationContainer>
					<this.stack.Navigator>
						<this.stack.Screen name="Home" component={Home} />
						{currentApp && (
							<this.stack.Screen name={currentApp.name} component={AppView} />
						)}
					</this.stack.Navigator>
				</NavigationContainer>
			</DesktopContext.Provider>
		);
	}
}

export default Desktop;
