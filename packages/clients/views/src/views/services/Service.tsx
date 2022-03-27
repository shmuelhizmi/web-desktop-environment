import React from "react";
import ServiceView from "@web-desktop-environment/interfaces/lib/views/desktop/service";
import { asFullStackView } from "@utils/functionComponent";
import { MenuBarItemPortal } from "@root/hooks/MenuBarItemPortal";
import { MenuBarAction } from "@components/menubarAction";

export default asFullStackView<ServiceView>((props) => {
	return (
		<MenuBarItemPortal>
			<MenuBarAction {...props} />
		</MenuBarItemPortal>
	);
});
