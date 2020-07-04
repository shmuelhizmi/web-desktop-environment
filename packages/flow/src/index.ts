import { Reflow, Transports } from "@mcesystems/reflow";
import { ViewInterfacesType, viewInterfaces } from "@web-desktop-environment/interfaces/lib";
import desktop from './flows/desktop'
import { portManager } from "./flows/shared/utils/checkPort";

export const createReflow = (port: number) => new Reflow<ViewInterfacesType>({
	transport:new Transports.WebSocketsTransport({ port }),
	views: viewInterfaces,
})
portManager.getPort(5000).then((port) => {
	const reflow = createReflow(port);
	console.log(`starting webOS on port ${port}`)
	reflow.start(desktop).then(() => {
		console.log("app exist")
	})

})