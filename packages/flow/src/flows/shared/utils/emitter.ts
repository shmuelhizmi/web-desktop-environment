import { EventEmitter as Events } from "events";

export default class Emiiter<EventList> {
  private emitter = new Events();

  public call = <T extends keyof EventList>(event: T, data: EventList[T]) =>
    this.emitter.emit(event as string, data);

  public on = <T extends keyof EventList>(
    event: T,
    listener: (data: EventList[T]) => void
  ) => {
    const maxListensers = this.emitter.getMaxListeners();
    if (maxListensers <= this.emitter.listenerCount(event as string)) {
      this.emitter.setMaxListeners(maxListensers + 10);
    }
    this.emitter.on(event as string, listener);
  };
}
