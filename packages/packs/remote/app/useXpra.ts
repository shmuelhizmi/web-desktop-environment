import { useProcess } from "@web-desktop-environment/app-sdk/lib";
import API from "@web-desktop-environment/server-api/lib";
import { useEffect, useState } from "react";

export function useXpra(start: boolean) {
	const [portAndDomain, setPortAndDomain] = useState<
		{ port: number; domain: string } | undefined
	>();
	const { domain, port } = portAndDomain || {};
	const { status, kill, process, error } = useProcess({
		command: "xpra",
		start: !!portAndDomain,
		args: [
			"--no-daemon",
			"--sharing=yes",
			`--bind-ws=127.0.1:${port}`,
			"--html=off",
			"--start-via-proxy=no",
			// "--auth=none",
			"start",
			":15",
		],
	});
	useEffect(() => {
		if (start) {
			API.portManager.withDomain().then(({ domain, port }) => {
				setPortAndDomain({ domain, port });
			});
		} else {
			kill();
		}
	}, [start]);

	useEffect(() => {
		if (error) {
			globalThis.process.exit(1);
		}
	}, [error]);

	return {
		status,
		kill,
		xpra: process,
		domain,
		error,
	};
}
