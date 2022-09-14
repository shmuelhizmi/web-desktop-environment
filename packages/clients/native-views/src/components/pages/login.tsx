import React from "react";
import { Button, Switch, Text, TextInput, View } from "react-native";
import { useLogin } from "../../hooks/login";

const Login = () => {
	const login = useLogin();

	return (
		<>
			{!login.isLoggingIn && (
				<View>
					<TextInput
						placeholder="Host"
						value={login.host}
						onChangeText={login.setHost}
					/>
					<TextInput
						placeholder="Port"
						value={login.port}
						onChangeText={login.setPort}
					/>
					<TextInput
						placeholder="Code"
						value={login.code}
						onChangeText={login.setCode}
					/>
					<Switch value={login.isHttps} onValueChange={login.setIsHttps} />
					<Button title="Login" onPress={login.fetchToken} />
				</View>
			)}
			{login.isLoggingIn && (
				<View>
					<Text>Logging in...</Text>
				</View>
			)}
		</>
	);
};

export default Login;
