import React, { createContext, useContext } from "react";
import { createPortal } from "react-dom";

export const MenuBarLinkContext = createContext<React.RefObject<HTMLElement>>(
	undefined as any
);

export const MenuBarItemPortal = (props: { children: React.ReactNode }) => {
	const container = useContext(MenuBarLinkContext);

	return (
		<>
			{container.current
				? createPortal(props.children, container.current)
				: props.children}
		</>
	);
};
