import React, { useEffect, useRef, useState } from "react";
import { XpraWindowManager } from "xpra-html5-client";
import type { XpraWrapperProps } from "../shared/types";
import { EntryPointProps } from "@web-desktop-environment/interfaces/lib/web/sdk";
import { useXpra } from "./hooks/xpra";
import { XpraWindowRenderer } from "./window";

export const XpraWindowManagerContext =
	React.createContext<XpraWindowManager | null>(null);

function XpraWrapper(props: XpraWrapperProps) {
	const winRef = useRef<HTMLDivElement>(null);
	const { vm, windows, xpra } = useXpra(props);
	const [iconWindowMap, setIconWindowMap] = useState<Record<string, string>>(
		{}
	);
	useEffect(() => {
		if (vm && winRef.current) {
			vm.setDesktopElement(document.querySelector("#app"));
		}
	}, [vm, winRef.current]);

	useEffect(() => {
		if (xpra) {
			xpra.on("windowIcon", ({ wid, image }) => {
				setIconWindowMap((prev) => ({
					...prev,
					[wid]: image,
				}));
			});
		}
	}, [xpra]);

	return (
		<div ref={winRef}>
			<XpraWindowManagerContext.Provider value={vm}>
				{windows.map((win) => (
					<XpraWindowRenderer
						key={win.attributes.id}
						icon={iconWindowMap[win.attributes.id]}
						vm={vm!}
						window={win}
						xpra={xpra!}
					/>
				))}
			</XpraWindowManagerContext.Provider>
		</div>
	);
}

export default function main(props: EntryPointProps) {
	return {
		XpraWrapper,
	};
}
