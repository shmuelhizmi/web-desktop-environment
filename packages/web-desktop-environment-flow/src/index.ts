import { Reflow, Transports } from "@mcesystems/reflow";
import { ViewInterfacesType, viewInterfaces } from "web-desktop-environment-interfaces/lib";
import desktop from './flows/desktop'

const reflow = new Reflow<ViewInterfacesType>({
	transport:new Transports.WebSocketsTransport({ port: 5000 }),
	views: viewInterfaces,
});
reflow.start(desktop).then(() => {
	console.log("flow1 is finished")
})