import AsyncStorage from "@react-native-community/async-storage";

interface LgoinParams {
	host: string;
	port: number;
}

interface LocalStorageItems {
	lastLoginParams: LgoinParams;
}

export const getKey = async <T extends keyof LocalStorageItems>(
	key: T
): Promise<LocalStorageItems[T] | undefined> => {
	try {
		const value = await AsyncStorage.getItem(key);
		if (value) {
			return JSON.parse(value) as LocalStorageItems[T];
		}
	} catch (e) {
		return undefined;
	}
};

export const setKey = async <T extends keyof LocalStorageItems>(
	key: T,
	value: LocalStorageItems[T]
) => AsyncStorage.setItem(key, JSON.stringify(value));
