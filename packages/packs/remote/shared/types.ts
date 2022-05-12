import { extendsViews, View } from "@web-desktop-environment/interfaces";

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

export const views = extendsViews<{
	XpraWrapper: View<XpraWrapperProps>;
}>("XpraWrapper");

export type Views = typeof views;
