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
import { DesktopContext } from "@views/Desktop";
import { ThemeContext } from "@views/warpper/ThemeProvider";
import Icon from "@components/icon";
import { Card } from "react-native-ui-lib";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";

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
				color: theme.background.text,
				fontWeight: "900",
			},
			captionContainer: {
				width: "100%",
				backgroundColor: theme.background.light,
				borderTopRightRadius: 15,
				borderTopLeftRadius: 15,
				borderBottomColor: theme.background.light,
				borderBottomWidth: 3,
			},
			appsCard: {
				backgroundColor: theme.background.main,
				width: "90%",
				height: "80%",
				margin: 25,
				borderRadius: 18,
				alignItems: "center",
				borderColor: theme.background.light,
				borderWidth: 3,
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
				width: "90%",
				flexDirection: "row",
				padding: 3,
				height: 85,
				paddingHorizontal: 10,
				margin: 7,
				marginBottom: 5,
				alignItems: "center",
				justifyContent: "space-between",
				backgroundColor: theme.background.light,
				borderColor: theme.background.text,
				borderWidth: 2,
			},
			appLaunchText: {
				textAlign: "center",
				fontWeight: "bold",
				fontSize: 45,
				color: theme.background.text,
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
															color={theme.background.text}
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
										style={{ flex: 3, width: "100%", alignItems: "center" }}
									>
										<View style={styles.appsCard}>
											<View style={styles.captionContainer}>
												<Text style={styles.caption}>Launch App</Text>
											</View>
											<ScrollView
												style={styles.appDrawer}
												contentContainerStyle={styles.appDrawerContainer}
											>
												{apps.map((app, index) => (
													<Card
														key={index}
														collapsable
														containerStyle={styles.appCard}
														onPress={() => desktop.launchApp(app)}
													>
														<Icon
															size={50}
															icon={app.nativeIcon}
															color={theme.background.text}
														/>
														<View style={{ flex: 4, margin: 2 }}>
															<Text style={styles.appLaunchText}>
																{app.name}
															</Text>
														</View>
													</Card>
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
