import { webDesktopEnvironmentInternalCommiunicationAppRunnerBroadcast } from "@root/const";
import { BroadcastChannel } from "broadcast-channel";

export const runApp = (name: string, input: Record<string, unknown>) => {
	const channel = new BroadcastChannel(
		webDesktopEnvironmentInternalCommiunicationAppRunnerBroadcast
	);
	return channel.postMessage({ name: name, input });
};
