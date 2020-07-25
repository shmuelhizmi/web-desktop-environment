import React from "react";
import {
	View,
	StyleSheet,
	Text,
	ImageBackground,
	ScrollView,
	Button,
	TouchableOpacity,
} from "react-native";
import { DesktopContext } from "@views/desktop";
import { ThemeContext } from "@components/themeProvider";
import { Theme } from "@root/theme";
import Icon from "@components/icon";

class Home extends React.Component {
	makeStyles = (theme: Theme) =>
		StyleSheet.create({
			root: {
				flexDirection: "column",
				alignContent: "center",
				flexWrap: "wrap",
				alignItems: "center",
				justifyContent: "center",
				flex: 1,
				backgroundColor: theme.background.dark,
			},
			caption: {
				fontSize: 45,
				textAlign: "center",
				fontFamily: "sans-serif-medium",
				width: "100%",
				color: theme.primary.text,
			},
			captionContainer: {
				width: "100%",
				backgroundColor: theme.background.light,
				borderTopRightRadius: 15,
				borderTopLeftRadius: 15,
				borderBottomColor: theme.windowBorderColor,
				borderBottomWidth: 1,
			},
			appsCard: {
				backgroundColor: theme.background.main,
				width: "90%",
				height: "80%",
				margin: 25,
				borderRadius: 15,
				alignItems: "center",
				borderColor: theme.windowBorderColor,
				borderWidth: 1,
			},
			appDrawer: {
				flex: 1,
				width: "100%",
				display: "flex",
			},
			appDrawerContainer: {
				alignItems: "center",
				margin: 5,
			},
			appCard: {
				width: "80%",
				flexDirection: "row",
				padding: 3,
				height: 55,
				paddingHorizontal: 10,
				margin: 7,
				marginBottom: 10,
				borderRadius: 5,
				alignItems: "center",
				justifyContent: "space-between",
				borderColor: theme.secondary.main,
				borderWidth: 2,
			},
		});

	render() {
		return (
			<ThemeContext.Consumer>
				{(theme) => (
					<DesktopContext.Consumer>
						{(desktop) => {
							const styles = this.makeStyles(theme);
							const { apps, openApps } = desktop;
							return (
								<ImageBackground
									source={{ uri: desktop.background }}
									style={styles.root}
								>
									<View
										style={{
											flex: 3,
											width: "100%",
											alignItems: "center",
											height: 150,
										}}
									>
										<View style={styles.appsCard}>
											<View style={styles.captionContainer}>
												<Text style={styles.caption}>Running Apps</Text>
											</View>
											<ScrollView
												style={styles.appDrawer}
												contentContainerStyle={styles.appDrawerContainer}
											>
												{openApps.map((openApp, index) => (
													<TouchableOpacity
														key={index}
														style={styles.appCard}
														delayPressIn={20}
														activeOpacity={0.9}
														onPress={() => desktop.setCurrentApp(openApp)}
													>
														<Icon
															size={50}
															icon={openApp.nativeIcon}
															color={theme.primary.text}
														/>
														<View style={{ flex: 4, margin: 2 }}>
															<Button
																color={theme.success.light}
																onPress={() => desktop.setCurrentApp(openApp)}
																title={`open - ${openApp.name}`}
															></Button>
														</View>
														<View style={{ flex: 1, margin: 2 }}>
															<Button
																color={theme.error.light}
																onPress={() => desktop.closeApp(openApp.id)}
																title={"X"}
															></Button>
														</View>
													</TouchableOpacity>
												))}
											</ScrollView>
										</View>
									</View>
									<View
										style={{ flex: 4, width: "100%", alignItems: "center" }}
									>
										<View style={styles.appsCard}>
											<View style={styles.captionContainer}>
												<Text style={styles.caption}>All Apps</Text>
											</View>
											<ScrollView
												style={styles.appDrawer}
												contentContainerStyle={styles.appDrawerContainer}
											>
												{apps.map((app, index) => (
													<TouchableOpacity
														key={index}
														style={styles.appCard}
														delayPressIn={20}
														activeOpacity={0.9}
														onPress={() => desktop.launchApp(app)}
													>
														<Icon
															size={50}
															icon={app.nativeIcon}
															color={theme.primary.text}
														/>
														<View style={{ flex: 4, margin: 2 }}>
															<Button
																color={theme.secondary.light}
																onPress={() => desktop.launchApp(app)}
																title={`launch - ${app.name}`}
															></Button>
														</View>
													</TouchableOpacity>
												))}
											</ScrollView>
										</View>
									</View>
								</ImageBackground>
							);
						}}
					</DesktopContext.Consumer>
				)}
			</ThemeContext.Consumer>
		);
	}
}
export default Home;
