import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from 'web-desktop-environment-interfaces'
import { apps } from "..";

export default <Flow<ViewInterfacesType>>(async ({ view, views }) => {
	// Using the view() function to display the MyView component, at layer 0 of this flow
	const desktop = view(0, views.desktop, {
        background: "#5555cc",
        apps: Object.keys(apps)
	});
	desktop.on("setBackground", ({ background }) => {
		desktop.update({ background });
    });
    await desktop;
});