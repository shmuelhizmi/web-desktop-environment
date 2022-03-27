import { useProcess } from "@web-desktop-environment/app-sdk/lib";
import API from "@web-desktop-environment/server-api/lib";
import { useEffect, useState } from "react";

export function useXpra(start: boolean) {
	const [portAndDomain, setPortAndDomain] = useState<
		{ port: number; domain: string } | undefined
	>();
	const { domain, port } = portAndDomain || {};
	const { status, kill, process } = useProcess({
		command: "xpra",
		start: !!portAndDomain,
		args: [
			"--no-daemon",
			"--bind-ws=127.0.0.1:" + port,
			"--html=off",
			"start",
			":15",
		],
	});
	useEffect(() => {
		if (start) {
			API.portManager.withDomian().then(setPortAndDomain);
		} else {
			kill();
		}
	}, [start]);

	return {
		status,
		kill,
		xpra: process,
		domain,
	};
}
