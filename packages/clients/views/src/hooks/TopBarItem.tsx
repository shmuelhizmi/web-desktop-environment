import React, { createContext, useContext } from "react";
import { createPortal } from "react-dom";

export const TopBarLinkContext = createContext<HTMLElement>(undefined as any);

export const TopBarItem = (props: { children: React.ReactNode }) => {
	const container = useContext(TopBarLinkContext);

	return (
		<>{container ? createPortal(props.children, container) : props.children}</>
	);
};
