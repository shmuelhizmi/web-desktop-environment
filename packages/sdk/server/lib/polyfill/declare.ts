import { BroadcastChannel, EventContext } from "broadcast-channel";

declare global {
	interface MessageEvent {
		data: any;
		origin: string;
		source: BroadcastChannel;
		ports: any[];
		lastEventId: string;
		channel: string;
		eventContext: EventContext;
		type: string;
	}
}
