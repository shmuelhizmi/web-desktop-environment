import Events from "events";

export default class Emitter<EventList> {
	private emitter = new Events().setMaxListeners(0); // Infinity

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
