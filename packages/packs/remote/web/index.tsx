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

	// const tree = orderXpraWindows(windows);

	// const renderLeaf = (leaf: Tree<XpraWindowManagerWindow>) => {
	// 	return (
	// 		<XpraWindowRenderer
	// 			key={leaf.value.attributes.id}
	// 			icon={iconWindowMap[leaf.value.attributes.id]}
	// 			vm={vm!}
	// 			window={leaf.value}
	// 			xpra={xpra!}
	// 			position={{
	// 				x: leaf.value.attributes.position[0],
	// 				y: leaf.value.attributes.position[1],
	// 			}}
	// 		>
	// 			{leaf.children.map(renderLeaf)}
	// 		</XpraWindowRenderer>
	// 	);
	// };

	return (
		<div ref={winRef}>
			<XpraWindowManagerContext.Provider value={vm}>
				{windows.map((window) => (
					<XpraWindowRenderer
						key={window.attributes.id}
						icon={iconWindowMap[window.attributes.id]}
						vm={vm!}
						window={window}
						xpra={xpra!}
					/>
				))}
			</XpraWindowManagerContext.Provider>
		</div>
	);
}

// function orderXpraWindows(
// 	windows: XpraWindowManagerWindow[]
// ): Tree<XpraWindowManagerWindow>[] {
// 	const roots = windows.filter(
// 		(win) => !win.attributes.metadata["transient-for"]
// 	);
// 	const getTransients = (
// 		win: XpraWindowManagerWindow
// 	): Tree<XpraWindowManagerWindow> => {
// 		return {
// 			value: win,
// 			children: windows
// 				.filter(
// 					(w) => w.attributes.metadata["transient-for"] === win.attributes.id
// 				)
// 				.map((w) => getTransients(w)),
// 		};
// 	};
// 	return roots.map((root) => getTransients(root));
// // }

// type Tree<T> = {
// 	value: T;
// 	children: Tree<T>[];
// };

export default function main(props: EntryPointProps) {
	return {
		XpraWrapper,
	};
}
