import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import { desktopViews } from "@views/index";
import LinearGradient from "react-native-linear-gradient";
import { getKey, setKey } from "@root/localstorage";
import { Client } from "@react-fullstack/fullstack-socket-client";

class ReactFullstackConnectionManager {
	public readonly host: string;
	constructor(host: string) {
		this.host = host;
	}
	connect = (
		port: number
	): {
		port: number;
		host: string;
	} => {
		return {
			host: this.host,
			port,
		};
	};
}

export let reactFullstackConnectionManager: ReactFullstackConnectionManager;

export const connectToServer = (host: string, port: number) => {
	reactFullstackConnectionManager = new ReactFullstackConnectionManager(host);

	return reactFullstackConnectionManager.connect(port);
};

declare const global: { HermesInternal: null | {} };

const styles = StyleSheet.create({
	root: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	connectedRoot: {
		flex: 1,
	},
	desktopRoot: {
		flex: 1,
	},
	card: {
		width: "90%",
		borderRadius: 15,
		height: 420,
		backgroundColor: "#333333",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		color: "#d9d9da",
		textAlign: "center",
		fontSize: 30,
		margin: 15,
	},
	input: {
		textAlign: "center",
		fontSize: 30,
		margin: 15,
		backgroundColor: "#444",
		color: "#fff",
		borderRadius: 10,
		width: "70%",
	},
	button: {
		textAlign: "center",
		margin: 15,
		backgroundColor: "#444",
		color: "#fff",
		width: "70%",
	},
	dissconnectButton: {
		width: "100%",
		height: 35,
	},
});

const App = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [host, setHost] = useState("localhost");
	const [port, setPort] = useState(5000);
	const loadLastParams = async () => {
		const lastParams = await getKey("lastLoginParams");
		if (lastParams) {
			setHost(lastParams.host);
			setPort(lastParams.port);
		}
	};
	useEffect(() => {
		loadLastParams();
	}, []);
	useEffect(() => {
		setKey("lastLoginParams", { host, port });
	}, [host, port]);
	return isConnected ? (
		<View style={styles.connectedRoot}>
			<View style={styles.dissconnectButton}>
				<Button onPress={() => setIsConnected(false)} title="dissconnect" />
			</View>
			<View style={styles.desktopRoot}>
				<Client {...connectToServer(host, port)} views={desktopViews} />
			</View>
		</View>
	) : (
		<LinearGradient colors={["#1dd969", "#00bdff"]} style={styles.root}>
			<View style={styles.card}>
				<Text style={styles.title}>Login to server</Text>
				<TextInput
					style={styles.input}
					value={host}
					onChange={(e) => setHost(e.nativeEvent.text)}
					placeholder="server host"
				/>
				<TextInput
					style={styles.input}
					value={String(port || "")}
					onChange={(e) => setPort(Number(e.nativeEvent.text || 0))}
					placeholder="server host"
				/>
				<View style={styles.button}>
					<Button
						color={styles.button.backgroundColor}
						onPress={() => setIsConnected(true)}
						title="Connect"
					/>
				</View>
			</View>
		</LinearGradient>
	);
};

export default App;
