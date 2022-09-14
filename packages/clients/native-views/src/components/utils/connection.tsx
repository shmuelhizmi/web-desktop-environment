import { Client } from "@react-fullstack/fullstack-socket-client";
import React from "react";

export function createClient<C extends Record<string, React.ComponentType>>({
	host,
	https,
	port,
	domain,
	components,
	token,
	fallback,
}: {
	host: string;
	https: boolean;
	port: number;
	domain: string;
	token: string;
	components: C;
	fallback?: React.ComponentType;
}) {
	const componentsProxy = new Proxy(components, {
		get(target, name) {
			return target[name as keyof C] || fallback;
		},
	});
	return () => (
		<Client
			host={`${https ? "https" : "http"}://${host}`}
			port={port}
			views={componentsProxy}
			socketOptions={{
				transports: ["websocket"],
				path: `/${domain}/${token}/socket.io`,
			}}
		/>
	);
}
