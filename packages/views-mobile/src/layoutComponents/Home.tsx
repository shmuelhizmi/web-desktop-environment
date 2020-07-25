import React from "react";
import { View, StyleSheet } from "react-native";
import { DesktopContext } from "@views/desktop";

class Home extends React.Component {
	makeStyles = () =>
		StyleSheet.create({
			root: {
				flexDirection: "column",
				alignItems: "center",
				flexWrap: "wrap",
				flex: 1,
			},
		});

	render() {
		const styles = this.makeStyles();
		return (
			<DesktopContext.Consumer>
				{(desktop) => {
					const { apps, openApps } = desktop;
					return <View style={styles.root}></View>;
				}}
			</DesktopContext.Consumer>
		);
	}
}
export default Home;
