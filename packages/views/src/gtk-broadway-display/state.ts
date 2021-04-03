import Emitter from "@utils/Emitter";

type ConnectionStatus = "disconnected" | "connected" | "connecting";

interface GTKBridgeEvents {
	status: ConnectionStatus;
}

export const GTKBridgeEmitter = new Emitter<GTKBridgeEvents>();

export let status: ConnectionStatus = "disconnected";

GTKBridgeEmitter.on("status", (newStatus) => (status = newStatus));
