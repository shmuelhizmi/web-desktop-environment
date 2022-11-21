import { useViews as useViewsBase } from "@react-fullstack/fullstack/server";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";

export function useViews() {
	return useViewsBase<ViewInterfacesType>();
}
