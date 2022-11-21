export const webDesktopEnvironmentInternalCommunicationBroadcast =
	"web_desktop_environment_internal_broadcast_app_runner";

export interface Requests {
	launch: {
		name: string;
		input: Record<string, unknown>;
	};
	getApps: {};
	getAppsResponse: {
		apps: Record<string, unknown>;
	};
}

export type Request = {
	[K in keyof Requests]: {
		type: K;
	} & Requests[K];
}[keyof Requests];
