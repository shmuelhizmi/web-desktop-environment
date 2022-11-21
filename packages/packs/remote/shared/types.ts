import { View, ViewInterfacesType } from "@web-desktop-environment/interfaces";

export interface XpraEvents {
	onConnect: () => void;
	onDisconnect: () => void;
	onError: (message: string) => void;
	onSessionStarted: () => void;
}

export interface XpraWrapperProps extends XpraEvents {
	domain: string;
	children?: React.ReactNode;
}

export type Views = ViewInterfacesType & {
	XpraWrapper: View<XpraWrapperProps>;
};
