import http from "http";
import { useEffect, useState } from "react";

export function usePing(run: boolean, port?: number) {
	const [pingedSuccessfully, setPingedSuccessfully] = useState(false);
	const [timeout, setCurrentTimeout] = useState<NodeJS.Timeout | undefined>();
	useEffect(() => {
		if (!pingedSuccessfully && run && port) {
			const currentTimeout = setTimeout(() => {
				http
					.get(`http://127.0.0.1:${port}`, () => {
						setPingedSuccessfully(true);
					})
					.on("error", () => {
						setPingedSuccessfully(false);
					});
				setCurrentTimeout(currentTimeout);
			}, 250);
		}
	}, [timeout, pingedSuccessfully, run, port]);
	return {
		pingedSuccessfully,
	};
}
