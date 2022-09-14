import { createStore } from "./stores";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { StorageKeys } from "../consts/stoarge";

const getSyncData = (key: string, fallback: string) =>
	Platform.OS === "web" ? localStorage.getItem(key) || fallback : fallback;

export const [useLogin, LoginProvider, withLogin] = createStore(
	() => {
		return {
			host: getSyncData(StorageKeys.loginHost, "localhost"),
			port: getSyncData(StorageKeys.loginPort, "5000"),
			code: "",
			isHttps: getSyncData(StorageKeys.loginIsHttps, "false") === "true",
			token: null as string | null,
			isLoggingIn: false,
		};
	},
	(get, set) => {
		const setKey = async (key: string, value: string) => {
			if (Platform.OS === "web") {
				localStorage.setItem(key, value);
			} else {
				await AsyncStorage.setItem(key, value);
			}
		};
		return {
			async syncData() {
				if (Platform.OS !== "web") {
					const [host, port, isHttps] = await Promise.all([
						AsyncStorage.getItem(StorageKeys.loginHost),
						AsyncStorage.getItem(StorageKeys.loginPort),
						AsyncStorage.getItem(StorageKeys.loginIsHttps),
					]);
					set({
						host: host || get().host,
						port: port || get().port,
						isHttps: isHttps ? isHttps === "true" : get().isHttps,
					});
				}
			},
			get host() {
				return get().host;
			},
			setHost(host: string) {
				set({ host });
				setKey(StorageKeys.loginHost, host);
			},
			get port() {
				return get().port;
			},
			setPort(port: string) {
				set({ port });
				setKey(StorageKeys.loginPort, port);
			},
			get code() {
				return get().code;
			},
			setCode(code: string) {
				set({ code });
			},
			get isHttps() {
				return get().isHttps;
			},
			setIsHttps(isHttps: boolean) {
				set({ isHttps });
				setKey(StorageKeys.loginIsHttps, isHttps ? "true" : "false");
			},
			get url() {
				const { host, port, isHttps } = get();
				return `${isHttps ? "https" : "http"}://${host}:${Number(port)}`;
			},
			get loginUrl() {
				return this.url + "/login";
			},
			get isLoggingIn() {
				return get().isLoggingIn;
			},
			get isLoggedIn() {
				return get().token !== null;
			},
			get token() {
				return get().token;
			},
			async fetchToken() {
				set({ isLoggingIn: true });
				return fetch(this.loginUrl, {
					method: "POST",
					body: this.code,
				})
					.then((res) => res.json())
					.then(
						(res) =>
							set({
								token: res.token,
								isLoggingIn: false,
							}).token
					)
					.catch((err) => {
						console.error(err);
						set({
							isLoggingIn: false,
						});
						return null;
					});
			},
		};
	}
);
