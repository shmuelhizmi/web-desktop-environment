import React, { type PropsWithChildren } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Client } from "@react-fullstack/fullstack-socket-client";
import { useLogin, withLogin } from "./hooks/login";
import Login from "./components/pages/login";

const App = () => {
	const login = useLogin();

	return (
		<SafeAreaView>
			{login.isLoggedIn ? (
				<Client
					host={login.host}
					port={Number(login.port)}
					views={Views}
					socketOptions={{
						transports: ["websocket"],
						path: `/desktop/${login.token}/socket.io`,
					}}
				/>
			) : (
				<Login />
			)}
		</SafeAreaView>
	);
};

const Views = new Proxy(
	{},
	{
		get: (_, prop) => {
			return (props: PropsWithChildren<any>) => {
				return (
					<View>
						<Text>View - {prop}</Text>
						<View style={{ marginLeft: 5 }}>{props.children}</View>
					</View>
				);
			};
		},
	}
);

export default withLogin(App);
