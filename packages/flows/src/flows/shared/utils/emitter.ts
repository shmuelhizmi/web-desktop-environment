import { EventEmitter as Events } from "events";

export default class Emiiter<EventList> {
	private emitter = new Events();

	public call = <T extends keyof EventList>(event: T, data: EventList[T]) =>
		this.emitter.emit(event as string, data);

	public on = <T extends keyof EventList>(
		event: T,
		listener: (data: EventList[T]) => void
	) => {
		this.emitter.on(event as string, listener);
		return {
			remove: () => this.off(event, listener),
			on: this.on,
			call: (data: EventList[T]) => this.call(event, data),
		};
	};

	public off = <T extends keyof EventList>(
		event: T,
		listener: (data: EventList[T]) => void
	) => this.emitter.off(event as string, listener);
}
