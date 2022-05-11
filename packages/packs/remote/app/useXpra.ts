import { useProcess } from "@web-desktop-environment/app-sdk/lib";
import API from "@web-desktop-environment/server-api/lib";
import { useEffect, useState } from "react";
import { usePing } from "./usePing";

export function useXpra(run: boolean) {
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
			"start",
			":15",
		],
	});
	const { pingedSuccessfully } = usePing(run, port);
	useEffect(() => {
		if (run) {
			API.portManager.withDomain().then(({ domain, port }) => {
				setPortAndDomain({ domain, port });
			});
		}
	}, [run]);

	useEffect(() => {
		if (run && pingedSuccessfully) {
			API.x11Manager.setActiveDisplay(15);
		}
	}, [pingedSuccessfully]);

	return {
		status,
		pingedSuccessfully,
		kill,
		xpra: process,
		domain,
		error,
	};
}
