import Events from "events";

export default class Emiiter<EventList> {
	private emitter = new Events();

	public call = <T extends keyof EventList>(event: T, data: EventList[T]) =>
		this.emitter.emit(event as string, data);

	public on = <T extends keyof EventList>(
		event: T,
		listener: (data: EventList[T]) => void
	) => this.emitter.on(event as string, listener);

	public removeListener = <T extends keyof EventList>(
		event: T,
		listener: (data: EventList[T]) => void
	) => this.emitter.removeListener(event as string, listener);
}
