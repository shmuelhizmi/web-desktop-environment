import React, { createContext, useContext } from "react";
import { createPortal } from "react-dom";

export const MenuBarLinkContext = createContext<HTMLElement>(undefined as any);

export const MenuBarItemPortal = (props: { children: React.ReactNode }) => {
	const container = useContext(MenuBarLinkContext);
	
	return (
		<>{container ? createPortal(props.children, container) : props.children}</>
	);
};
