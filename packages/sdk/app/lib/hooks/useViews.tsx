import React from "react";
import { AppContext } from "@react-fullstack/fullstack";
import { ViewsToServerComponents } from "@react-fullstack/fullstack/lib/Views";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";

export function useViews() {
	const app = React.useContext(AppContext);
	const views = app.views;
	return views as ViewsToServerComponents<ViewInterfacesType>;
}
