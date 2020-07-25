import React from "react";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import DesktopInterface, {
	App,
	OpenApp,
} from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@layoutComponents/Home";
import AppView from "@layoutComponents/AppView";
import { StyleSheet } from "react-native";
import { Theme } from "@root/theme";
import { ThemeContext } from "@components/themeProvider";
import Icon from "@components/icon";

interface DesktopContextInterface {
	openApps: OpenApp[];
	apps: App[];
	currentApp?: OpenApp;
	background?: string;
	setCurrentApp: (currentApp: OpenApp) => void;
	closeApp: (id: number) => void;
	launchApp: (newApp: App) => void;
}

export const DesktopContext = React.createContext<DesktopContextInterface>({
	apps: [],
	openApps: [],
	setCurrentApp: () => {
		/* */
	},
	closeApp: () => {
		/* */
	},
	launchApp: () => {
		/* */
	},
});

interface DesktopState {
	currentApp?: OpenApp;
}

class Desktop extends ReflowReactComponent<DesktopInterface, {}, DesktopState> {
	state: DesktopState = {};

	navigator = createBottomTabNavigator();

	makeStyles = (theme: Theme) =>
		StyleSheet.create({
			tabBar: {
				backgroundColor: theme.background.main,
				borderTopColor: theme.windowBorderColor,
				borderTopWidth: 2,
			},
		});

	render() {
		const { currentApp } = this.state;
		const { apps, openApps, background, event } = this.props;
		return (
			<ThemeContext.Consumer>
				{(theme) => {
					const styles = this.makeStyles(theme);
					return (
						<DesktopContext.Provider
							value={{
								openApps: openApps,
								apps: apps,
								currentApp: currentApp,
								background,
								setCurrentApp: (newCurrentApp) =>
									this.setState({ currentApp: newCurrentApp }),
								launchApp: (app) =>
									event("launchApp", { flow: app.flow, params: {} }),
								closeApp: (id) => event("closeApp", id),
							}}
						>
							<NavigationContainer>
								<this.navigator.Navigator
									screenOptions={({ route }) => ({
										tabBarIcon: ({ color, size }) =>
											route.name === "Home" || !currentApp ? (
												<Icon
													icon={{
														icon: "home",
														type: "MaterialCommunityIcons",
													}}
													size={size}
													color={color}
												/>
											) : (
												<Icon
													icon={currentApp.nativeIcon}
													size={size}
													color={color}
												/>
											),
									})}
									tabBarOptions={{ style: styles.tabBar }}
								>
									<this.navigator.Screen name="Home" component={Home} />
									{currentApp && (
										<this.navigator.Screen
											name="Running-App"
											component={AppView}
										/>
									)}
								</this.navigator.Navigator>
							</NavigationContainer>
						</DesktopContext.Provider>
					);
				}}
			</ThemeContext.Consumer>
		);
	}
}

export default Desktop;
