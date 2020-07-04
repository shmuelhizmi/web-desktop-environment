import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from '@web-desktop-environment/interfaces'
import { apps } from "..";

export default <Flow<ViewInterfacesType>>(async ({ view, views }) => {
	// Using the view() function to display the MyView component, at layer 0 of this flow
	const window = view(0, views.window, {
        icon: {icon: "Calculator", type: "fluentui"},
        title: "Calculator",
        window: {
            width: 650,
            height: 500,
        }
	});
    await window;
});