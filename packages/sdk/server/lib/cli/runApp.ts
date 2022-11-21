import {
	webDesktopEnvironmentInternalCommunicationBroadcast,
	Request,
} from "../const";
import { BroadcastChannel } from "broadcast-channel";

const channel = new BroadcastChannel<Request>(
	webDesktopEnvironmentInternalCommunicationBroadcast
);

export const runApp = (name: string, input: Record<string, unknown>) => {
	return channel.postMessage({ type: "launch", input, name });
};

export const getApps = (): Promise<Record<string, unknown>> => {
	return new Promise((resolve) => {
		channel.addEventListener("message", (msg) => {
			if (msg.type === "getAppsResponse") {
				resolve(msg.apps);
			}
		});
		channel.postMessage({ type: "getApps" });
	});
};
