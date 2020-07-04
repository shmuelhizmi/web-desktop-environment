import { Reflow, Transports } from "@mcesystems/reflow";
import { ViewInterfacesType, viewInterfaces } from "@web-desktop-environment/interfaces/lib";
import desktop from './flows/desktop'

export const createReflow = (port: number) => new Reflow<ViewInterfacesType>({
	transport:new Transports.WebSocketsTransport({ port }),
	views: viewInterfaces,
})

const reflow = createReflow(5000);

reflow.start(desktop).then(() => {
	console.log("app exist")
})