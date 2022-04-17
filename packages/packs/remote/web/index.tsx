import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	XpraClient,
	XpraWindowManager,
	XpraWindowManagerWindow,
} from "xpra-html5-client";
import type { XpraEvents, XpraWrapperProps } from "../shared/types";
import "@web-desktop-environment/interfaces/lib/web/sdk";
// import XpraPacketWorker from "./xpraWorker?worker&inline";
// import XpraDecodeWorker from "./xpraWorker/decoder?worker&inline";

async function createXpraClient(events: XpraEvents) {
	const worker = new Worker(new URL("./xpraWorker", import.meta.url), {
		type: "module",
	});
	const decoder = new Worker("./xpraWorker/decoder", {
		type: "module",
	});
	const xpra = new XpraClient({ worker, decoder });
	// Set up internals
	await xpra.init();
	// Set up events
	// Refer to documentation of `XpraConnectionEventEmitters` for all events
	xpra.on("connect", events.onConnect);
	xpra.on("disconnect", events.onDisconnect);
	xpra.on("error", events.onError);
	xpra.on("sessionStarted", events.onSessionStarted);
	xpra.on("connect", () => console.log("connected to host"));
	xpra.on("disconnect", () => console.warn("disconnected from host"));
	xpra.on("error", (message) => console.error("connection error", message));
	xpra.on("sessionStarted", () => console.info("session has been started"));
	return xpra;
}

export const XpraWindowManagerContext =
	React.createContext<XpraWindowManager | null>(null);

export function XpraWrapper(props: XpraWrapperProps) {
	const [xpra, setXpra] = useState<XpraClient | null>(null);
	const winRef = useRef<HTMLDivElement>(null);
	const [windows, setWindows] = useState<XpraWindowManagerWindow[]>([]);
	useEffect(() => {
		createXpraClient(props).then((xpra) => {
			setXpra(xpra);
			const { host, token, port } = window.wdeSdk;
			xpra.connect(`ws://${props.domain}.${token}.${host}:${port}`, {
				reconnect: true,
				connectionTimeout: 30000,
				reconnectInterval: 5000,
				reconnectAttempts: 3,
				pingInterval: 5000,
				bandWidthLimit: 0,
				startNewSession: null,
				shareSession: false,
				stealSession: false,
				username: "",
				display: "",
				password: "",
				showStartMenu: true,
				fileTransfer: true,
				clipboardImages: false,
				clipboardDirection: "both",
				clipboard: true,
				printing: false,
				bell: true,
				audio: true,
				video: false,
				nativeVideo: false,
				cursor: true,
				keyboard: true,
				mouse: true,
				tray: true,
				notifications: true,
				ssl: false,
				encryption: null,
				encryptionKey: "",
				encoder: "auto",
				openUrl: true,
				swapKeys: false,
				keyboardLayout: "us",
				exitWithChildren: false,
				exitWithClient: false,
				startCommand: "",
				reverseScrollX: false,
				reverseScrollY: false,
				debugPackets: ["general", "window", "notification", "clipboard"],
				showStatistics: false,
			});
		});
	}, []);
	const vm = useMemo(() => {
		if (!xpra) {
			return null;
		}
		const xpraWindowManager = new XpraWindowManager(xpra);
		xpraWindowManager.init();
		xpra.on("newWindow", (win) => {
			console.log("new window", win);
			const window = xpraWindowManager.getWindow(win.id);
			if (window) {
				setWindows((w) => [...w, window]);
			}
		});
		xpraWindowManager.setDesktopElement(winRef.current);
		return xpraWindowManager;
	}, [xpra]);
	return (
		<div ref={winRef}>
			<XpraWindowManagerContext.Provider value={vm}>
				{windows.map(({ canvas, attributes }) => (
					<div
						key={attributes.id}
						ref={(ref) => {
							if (ref && !ref.children.length) {
								ref.appendChild(canvas);
							}
						}}
					/>
				))}
			</XpraWindowManagerContext.Provider>
		</div>
	);
}
