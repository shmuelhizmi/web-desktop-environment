import { useEffect, useMemo, useState } from "react";
import {
	XpraClient,
	XpraWindowManager,
	XpraWindowManagerWindow,
} from "xpra-html5-client";
import { XpraEvents, XpraWrapperProps } from "../../shared/types";
import { xpraOptions } from "../consts/options";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import decoder from "worker-single-inline:./../xpraWorker/decoder";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import worker from "worker-single-inline:./../xpraWorker";

const DEBUG = window.location.search.includes("debug");

async function createXpraClient(events: XpraEvents) {
	const xpra = new XpraClient({ decoder, worker });
	// Set up internals
	await xpra.init();
	// Set up events
	// Refer to documentation of `XpraConnectionEventEmitters` for all events
	xpra.on("connect", events.onConnect);
	xpra.on("disconnect", events.onDisconnect);
	xpra.on("error", events.onError);
	xpra.on("sessionStarted", events.onSessionStarted);
	if (DEBUG) {
		xpra.on("connect", () => console.log("connected to host"));
		xpra.on("disconnect", () => console.warn("disconnected from host"));
		xpra.on("error", (message) => console.error("connection error", message));
		xpra.on("sessionStarted", () => console.info("session has been started"));
	}
	return xpra;
}

export function useXpra(props: XpraWrapperProps) {
	const [xpra, setXpra] = useState<XpraClient | null>(null);
	const [windows, setWindows] = useState<XpraWindowManagerWindow[]>([]);

	useEffect(() => {
		createXpraClient(props).then((xpra) => {
			setXpra(xpra);
			const { host, token, port, https } = window.wdeSdk;
			xpra.connect(
				`${https ? "wss" : "ws"}://${props.domain}.${token}.${host}:${port}`,
				xpraOptions
			);
		});
	}, []);

	const vm = useMemo(() => {
		if (!xpra) {
			return null;
		}
		const xpraWindowManager = new XpraWindowManager(xpra);
		xpraWindowManager.init();
		return xpraWindowManager;
	}, [xpra]);

	useEffect(() => {
		if (!xpra || !vm) {
			return;
		}
		xpra.on("newWindow", (win) => {
			if (DEBUG) {
				console.log("new window", win);
			}
			const window = vm.getWindow(win.id);
			if (window) {
				setWindows((w) => {
					w.push(window);
					return [...w];
				});
			}
		});
		xpra.on("removeWindow", (winID) => {
			if (DEBUG) {
				console.log("remove window", winID);
			}
			setWindows((w) => {
				const index = w.findIndex((w) => w.attributes.id === winID);
				if (index >= 0) {
					w.splice(index, 1);
				}
				return [...w];
			});
		});
	}, [xpra, vm]);

	return {
		xpra,
		windows,
		vm,
	};
}
