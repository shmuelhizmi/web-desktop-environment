import { useProcess } from "@web-desktop-environment/app-sdk/lib";
import API from "@web-desktop-environment/server-api/lib";
import { useEffect, useState } from "react";
import { usePing } from "./usePing";

export function useXpra(run: boolean) {
	const [portAndDomain, setPortAndDomain] = useState<
		{ port: number; domain: string } | undefined
	>();
	const { domain, port } = portAndDomain || {};
	const [display, setDisplay] = useState<number>(15);
	const { status, kill, process, error, restart } = useProcess({
		command: "xpra",
		start: !!portAndDomain,
		args: [
			"--no-daemon",
			"--sharing=yes",
			`--bind-ws=127.0.1:${port}`,
			"--html=off",
			"--start-via-proxy=no",
			"start",
			":" + display,
		],
	});
	const { pingedSuccessfully } = usePing(run, port);
	useEffect(() => {
		if (run) {
			API.portManager.withDomain().then(({ domain, port }) => {
				setPortAndDomain({ domain, port });
			});
		} else {
			setPortAndDomain(undefined);
		}
	}, [run]);

	useEffect(() => {
		if (status === "error" && display < 25) {
			setDisplay(display + 1);
		}
	}, [status]);

	useEffect(() => {
		if (status === "error" && !process && display < 25) {
			restart();
		}
	}, [display]);

	useEffect(() => {
		if (run && pingedSuccessfully) {
			API.x11Manager.setActiveDisplay(display);
		}
	}, [pingedSuccessfully, display]);

	return {
		status,
		pingedSuccessfully,
		kill,
		xpra: process,
		domain,
		error,
	};
}
