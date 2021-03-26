import SettingsInterface from "@web-desktop-environment/interfaces/lib/views/apps/system/Settings";
import {
	ThemeType,
	Theme,
} from "@web-desktop-environment/interfaces/lib/shared/settings";
import { Component } from "@react-fullstack/fullstack";
import React from "react";
import { Colors } from "@root/theme";
import StateComponent from "@components/stateComponent";
import {
	StyleSheet,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity,
	ImageBackground,
	Pressable,
} from "react-native";
import { ThemeContext } from "@views/wrapper/ThemeProvider";
import { View } from "react-native-ui-lib";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "@components/icon";
import { DesktopContext } from "@views/Desktop";
import { NativeIcon } from "@web-desktop-environment/interfaces/lib/shared/icon";
import { noAlpah } from "@utils/color";

interface SettingsCategory {
	path: string;
	icon: NativeIcon;
	iconColor: Colors;
	caption: string;
	subcaption: string;
}

class Settings extends Component<SettingsInterface> {
	constructor(props: Settings["props"]) {
		super(props);
	}

	settings = this.props.settings;

	makeStyles = (theme: Theme) =>
		StyleSheet.create({
			homeRoot: {
				flexDirection: "column",
				alignContent: "center",
				flexWrap: "wrap",
				alignItems: "center",
				flex: 1,
				backgroundColor: theme.background.main,
			},
			settingsSection: {
				backgroundColor: theme.background.main,
				width: "100%",
				alignItems: "center",
				borderBottomColor: theme.background.dark,
				borderBottomWidth: 1,
			},
			settingsSectionHeader: {
				fontSize: 18,
				marginLeft: 10,
				marginTop: 7,
				color: theme.primary.main,
				fontWeight: "600",
			},
			settingsOption: {
				fontSize: 20,
				color: theme.background.text,
			},
			categoryRoot: {
				flex: 1,
				backgroundColor:
					theme.type !== "transparent" ? theme.background.main : undefined,
			},
			settingsContegoryItem: {
				width: "100%",
				height: 80,
				flexDirection: "row",
				alignItems: "center",
				backgroundColor: theme.background.main,
			},
			settingsContegoryItemIcon: {
				width: 45,
				height: "55%",
				justifyContent: "center",
				alignItems: "center",
				borderRadius: 100,
				margin: 10,
			},
			settingsContegoryItemText: {
				flex: 5,
				justifyContent: "center",
			},
			settingsContegoryItemCaption: {
				fontSize: 24,
				color: theme.background.text,
			},
			settingsContegoryItemSubcaption: {
				color: theme.background.text,
				fontSize: 13,
			},
			settingsProperty: {
				width: "100%",
				height: 80,
				flexDirection: "row",
				padding: 8,
				justifyContent: "center",
				alignItems: "center",
			},
			settingsPropertyList: {
				width: "100%",
				flexDirection: "column",
				padding: 8,
				justifyContent: "center",
				alignItems: "center",
			},
			settingsPropertyName: {
				flex: 1,
				color: theme.background.text,
				fontSize: 30,
			},
			settingsPropertyValue: {
				borderBottomColor: theme.background.text,
				borderBottomWidth: 1,
				flex: 1,
			},
			settingsPropertyInput: {
				color: theme.background.text,
				textAlign: "center",
				fontSize: 15,
			},
			headerStyle: {
				backgroundColor: noAlpah(theme.background.main),
			},
			headerTitleStyle: {
				color: theme.background.text,
			},
			settingsPropertyPicker: {
				color: theme.background.text,
			},
		});

	renderDesktopCategory = () => {
		const { setSettings } = this.props;
		return (
			<ThemeContext.Consumer>
				{(theme) => {
					const styles = this.makeStyles(theme);
					const {
						nativeBackground: background,
						theme: themeType,
					} = this.settings.desktop;
					return (
						<StateComponent<{ theme: ThemeType; background: string }>
							defaultState={{ background, theme: themeType }}
						>
							{(state, setState) => (
								<ImageBackground
									source={{
										uri:
											theme.type === "transparent"
												? state.background
												: undefined,
									}}
									style={styles.categoryRoot}
								>
									<ScrollView style={styles.categoryRoot}>
										<View style={styles.settingsSection}>
											<View style={styles.settingsProperty}>
												<Text style={styles.settingsPropertyName}>
													background
												</Text>
												<View style={styles.settingsPropertyValue}>
													<TextInput
														style={styles.settingsPropertyInput}
														value={state.background}
														autoCorrect={false}
														multiline
														onChange={(e) => {
															const value = e.nativeEvent.text;
															setState({ background: value }, () => {
																this.settings.desktop.nativeBackground = value;
																setSettings(this.settings);
															});
														}}
													/>
												</View>
											</View>
											<View style={styles.settingsPropertyList}>
												<Text
													style={[
														styles.settingsPropertyName,
														{ width: "100%" },
													]}
												>
													theme
												</Text>
												{([
													{ name: "dark theme", value: "dark" },
													{
														name: "dark transparent theme",
														value: "transparentDark",
													},
													{ name: "transparent", value: "transparent" },
													{ name: "light theme", value: "light" },
												] as const).map((option) => (
													<Pressable
														key={option.value}
														style={styles.settingsProperty}
														onPress={() => {
															setState({ theme: option.value }, () => {
																this.settings.desktop.theme = option.value;
																setSettings(this.settings);
															});
														}}
													>
														<View style={{ flex: 6 }}>
															<Text style={styles.settingsOption}>
																{option.name}
															</Text>
														</View>
														<View style={{ flex: 1 }}>
															<Icon
																color={theme.primary.main}
																size={30}
																icon={{
																	icon:
																		state.theme === option.value
																			? "radio-button-on"
																			: "radio-button-off",
																	type: "Ionicons",
																}}
															/>
														</View>
													</Pressable>
												))}
											</View>
										</View>
									</ScrollView>
								</ImageBackground>
							)}
						</StateComponent>
					);
				}}
			</ThemeContext.Consumer>
		);
	};

	renderNetworkCategory = () => {
		const { setSettings } = this.props;
		const { endPort, mainPort, startPort } = this.props.settings.network.ports;
		return (
			<ThemeContext.Consumer>
				{(theme) => {
					const styles = this.makeStyles(theme);
					return (
						<StateComponent<{
							mainPort: number;
							startPort: number;
							endPort: number;
						}>
							defaultState={{ endPort, mainPort, startPort }}
						>
							{(state, setState) => (
								<ImageBackground
									source={{
										uri:
											theme.type === "transparent"
												? this.props.settings.desktop.nativeBackground
												: undefined,
									}}
									style={styles.categoryRoot}
								>
									<ScrollView style={styles.categoryRoot}>
										<Text style={styles.settingsSectionHeader}>
											Port Managment
										</Text>
										<View style={styles.settingsSection}>
											<View style={styles.settingsProperty}>
												<Text style={styles.settingsPropertyName}>
													main Port
												</Text>
												<View style={styles.settingsPropertyValue}>
													<TextInput
														style={[
															styles.settingsPropertyInput,
															{ fontSize: 30 },
														]}
														value={String(state.mainPort || "")}
														autoCorrect={false}
														keyboardType={"number-pad"}
														onChange={(e) => {
															let value = Number(e.nativeEvent.text);
															if (typeof value === "number" && value > 0) {
																value = value - (value % 1);
																setState({ mainPort: value }, () => {
																	this.settings.network.ports.mainPort = value;
																	setSettings(this.settings);
																});
															}
														}}
													/>
												</View>
											</View>
											<View style={styles.settingsProperty}>
												<Text style={styles.settingsPropertyName}>
													start Port
												</Text>
												<View style={styles.settingsPropertyValue}>
													<TextInput
														style={[
															styles.settingsPropertyInput,
															{ fontSize: 30 },
														]}
														value={String(state.startPort || "")}
														autoCorrect={false}
														keyboardType={"number-pad"}
														onChange={(e) => {
															let value = Number(e.nativeEvent.text);
															if (typeof value === "number" && value > 0) {
																value = value - (value % 1);
																setState({ startPort: value }, () => {
																	this.settings.network.ports.startPort = value;
																	setSettings(this.settings);
																});
															}
														}}
													/>
												</View>
											</View>
											<View style={styles.settingsProperty}>
												<Text style={styles.settingsPropertyName}>
													end Port
												</Text>
												<View style={styles.settingsPropertyValue}>
													<TextInput
														style={[
															styles.settingsPropertyInput,
															{ fontSize: 30 },
														]}
														value={String(state.endPort || "")}
														autoCorrect={false}
														keyboardType={"number-pad"}
														onChange={(e) => {
															let value = Number(e.nativeEvent.text);
															if (typeof value === "number" && value > 0) {
																value = value - (value % 1);
																setState({ endPort: value }, () => {
																	this.settings.network.ports.endPort = value;
																	setSettings(this.settings);
																});
															}
														}}
													/>
												</View>
											</View>
										</View>
									</ScrollView>
								</ImageBackground>
							)}
						</StateComponent>
					);
				}}
			</ThemeContext.Consumer>
		);
	};
	renderSystemInfoCategory = () => {
		return (
			<ThemeContext.Consumer>
				{(theme) => {
					const styles = this.makeStyles(theme);
					if (!this.props.systemInfo) {
						return <View style={styles.categoryRoot} />;
					}
					const { cpu, os } = this.props.systemInfo;
					return (
						<ImageBackground
							source={{
								uri:
									theme.type === "transparent"
										? this.props.settings.desktop.nativeBackground
										: undefined,
							}}
							style={styles.categoryRoot}
						>
							<ScrollView style={styles.categoryRoot}>
								{os && (
									<>
										<Text style={styles.settingsSectionHeader}>OS</Text>
										<View style={styles.settingsSection}>
											{os.hostname && (
												<View style={styles.settingsProperty}>
													<Text style={styles.settingsPropertyName}>
														hostname
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{os.hostname}
														</Text>
													</View>
												</View>
											)}
											{os.kernel && (
												<View style={styles.settingsProperty}>
													<Text style={styles.settingsPropertyName}>
														kernel
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{os.kernel}
														</Text>
													</View>
												</View>
											)}
											{os.platform && (
												<View style={styles.settingsProperty}>
													<Text style={styles.settingsPropertyName}>
														platform
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{os.platform}
														</Text>
													</View>
												</View>
											)}
										</View>
									</>
								)}
								{cpu && (
									<>
										<Text style={styles.settingsSectionHeader}>CPU</Text>
										<View style={styles.settingsSection}>
											{cpu.brandName && (
												<View style={styles.settingsProperty}>
													<Text
														style={[
															styles.settingsPropertyName,
															{ fontSize: 30 },
														]}
													>
														name
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{cpu.brandName}
														</Text>
													</View>
												</View>
											)}
											{cpu.manufacturer && (
												<View style={styles.settingsProperty}>
													<Text
														style={[
															styles.settingsPropertyName,
															{ fontSize: 20 },
														]}
													>
														manufacturer name
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{cpu.manufacturer}
														</Text>
													</View>
												</View>
											)}
											{cpu.cores && (
												<View style={styles.settingsProperty}>
													<Text
														style={[
															styles.settingsPropertyName,
															{ fontSize: 20 },
														]}
													>
														number of cores
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{cpu.cores}
														</Text>
													</View>
												</View>
											)}
											{cpu.physicalCores && (
												<View style={styles.settingsProperty}>
													<Text
														style={[
															styles.settingsPropertyName,
															{ fontSize: 20 },
														]}
													>
														number of physical cores
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{cpu.physicalCores}
														</Text>
													</View>
												</View>
											)}
											{cpu.speed && (
												<View style={styles.settingsProperty}>
													<Text
														style={[
															styles.settingsPropertyName,
															{ fontSize: 20 },
														]}
													>
														prcessor speed
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{cpu.speed} GHz
														</Text>
													</View>
												</View>
											)}
											{cpu.speedMax && (
												<View style={styles.settingsProperty}>
													<Text
														style={[
															styles.settingsPropertyName,
															{ fontSize: 20 },
														]}
													>
														prcessor maximum speed
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{cpu.speedMax} GHz
														</Text>
													</View>
												</View>
											)}
											{cpu.speedMin && (
												<View style={styles.settingsProperty}>
													<Text
														style={[
															styles.settingsPropertyName,
															{ fontSize: 20 },
														]}
													>
														prcessor minimum speed
													</Text>
													<View style={styles.settingsPropertyValue}>
														<Text
															style={[
																styles.settingsPropertyInput,
																{ fontSize: 25 },
															]}
														>
															{cpu.speedMin} GHz
														</Text>
													</View>
												</View>
											)}
										</View>
									</>
								)}
							</ScrollView>
						</ImageBackground>
					);
				}}
			</ThemeContext.Consumer>
		);
	};

	static categories: SettingsCategory[] = [
		{
			path: "category_desktop",
			icon: { icon: "desktop", type: "FontAwesome" },
			iconColor: "success",
			caption: "Desktop settings",
			subcaption: "customize your desktop",
		},
		{
			path: "category_network",
			icon: {
				icon: "network",
				type: "MaterialCommunityIcons",
			},
			iconColor: "primary",
			caption: "Network settings",
			subcaption: "manage ports",
		},
		{
			path: "category_info",
			icon: {
				icon: "md-hardware-chip-sharp",
				type: "Ionicons",
			},
			iconColor: "error",
			caption: "System info",
			subcaption: "see your server system info",
		},
	];

	renderHome = ({
		navigation,
	}: {
		navigation: { navigate: (route: string) => void };
	}) => {
		return (
			<DesktopContext.Consumer>
				{(desktop) => (
					<ThemeContext.Consumer>
						{(theme) => {
							const styles = this.makeStyles(theme);
							return (
								<ImageBackground
									source={{
										uri:
											theme.type === "transparent"
												? desktop.background
												: undefined,
									}}
									style={styles.homeRoot}
								>
									{Settings.categories.map((category, index) => (
										<TouchableOpacity
											key={index}
											style={styles.settingsContegoryItem}
											onPress={() => navigation.navigate(category.path)}
										>
											<View
												style={[
													styles.settingsContegoryItemIcon,
													{ backgroundColor: theme[category.iconColor].main },
												]}
											>
												<Icon
													icon={category.icon}
													size={20}
													color={theme[category.iconColor].text}
												></Icon>
											</View>
											<View style={styles.settingsContegoryItemText}>
												<Text style={styles.settingsContegoryItemCaption}>
													{category.caption}
												</Text>
												<Text style={styles.settingsContegoryItemSubcaption}>
													{category.subcaption}
												</Text>
											</View>
										</TouchableOpacity>
									))}
								</ImageBackground>
							);
						}}
					</ThemeContext.Consumer>
				)}
			</DesktopContext.Consumer>
		);
	};

	navigator = createStackNavigator();

	render() {
		return (
			<ThemeContext.Consumer>
				{(theme) => {
					const styles = this.makeStyles(theme);
					return (
						<NavigationContainer independent={true}>
							<this.navigator.Navigator
								screenOptions={{
									headerStyle: styles.headerStyle,
									headerTitleStyle: styles.headerTitleStyle,
									headerTintColor: theme.background.text,
								}}
							>
								<this.navigator.Screen
									name="Home"
									options={{ title: "Settings" }}
									component={this.renderHome}
								/>
								<this.navigator.Screen
									name="category_desktop"
									options={{ title: "Desktop Settings" }}
									component={this.renderDesktopCategory}
								/>
								<this.navigator.Screen
									name="category_network"
									options={{ title: "Network Settings" }}
									component={this.renderNetworkCategory}
								/>
								<this.navigator.Screen
									name="category_info"
									options={{ title: "System info" }}
									component={this.renderSystemInfoCategory}
								/>
							</this.navigator.Navigator>
						</NavigationContainer>
					);
				}}
			</ThemeContext.Consumer>
		);
	}
}

export default Settings;
