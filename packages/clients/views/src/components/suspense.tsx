import React from "react";
import { useTheme } from "@web-desktop-environment/web-sdk";

export default function Suspense() {
	const {
		background: { main: background },
	} = useTheme();
	return <div style={{ background, width: "100%", height: "100%" }} />;
}

export const withSuspense =
	<T extends {}>(Component: React.ComponentType<T>) =>
	(props: T) => {
		return (
			<React.Suspense fallback={<Suspense />}>
				<Component {...props} />
			</React.Suspense>
		);
	};

export const lazySuspense = <T extends {}>(
	load: () => Promise<{ default: React.ComponentType<T> }>
) => {
	const Lazy = React.lazy(load) as unknown as React.ComponentType<T>;
	return (props: T) => {
		return (
			<React.Suspense fallback={<Suspense />}>
				<Lazy {...props} />
			</React.Suspense>
		);
	};
};
