import { ViewInterface, ViewsMapInterface } from "./View";

export type PartialViewInterfaceInput<ViewsMap extends ViewsMapInterface, T extends ViewsMap[keyof ViewsMap]> = {
	[U in keyof T["input"]]?: T["input"][U]
};

export type ParamsUnpack<T> = T extends (params: infer U) => any ? U :
    T;

export type ReturnUnpack<T> = T extends (params: any) => infer U ? U :
	void;

export type PromiseUnpacked<T> =
    T extends Promise<infer U> ? U :
    T;

export type ViewInterfaceEvents<ViewsMap extends ViewsMapInterface, T extends ViewsMap[keyof ViewsMap]> = keyof T["events"];
export type ViewInterfaceEventData<ViewsMap extends ViewsMapInterface, T extends ViewsMap[keyof ViewsMap], U extends ViewInterfaceEvents<ViewsMap, T>> = ParamsUnpack<T["events"][U]>;
export type ViewInterfaceEventCallback<ViewsMap extends ViewsMapInterface, T extends ViewsMap[keyof ViewsMap], U extends ViewInterfaceEvents<ViewsMap, T>> = (data: ViewInterfaceEventData<ViewsMap, T, U>) => ReturnUnpack<T["events"][U]>;


export type ViewOnUpdateCallback<ViewsMap extends ViewsMapInterface, T extends ViewsMap[keyof ViewsMap]> = (input: PartialViewInterfaceInput<ViewsMap, T>) => void;
export type ViewOnRemoveCallback = () => void;

export class ViewProxy<ViewsMap extends ViewsMapInterface, T extends ViewsMap[keyof ViewsMap]> extends Promise<T["output"]> {
	private doneCalled = false;
	private doneCallValue: T["output"];
	private removed: boolean = false;
	private eventListeners: {
		[U in ViewInterfaceEvents<ViewsMap, T>]?: Array<ViewInterfaceEventCallback<ViewsMap, T, U>>
	};
	private resolve: (output: T["output"]) => void;
	private reject: (output: Error) => void = (output) => { };
	private onUpdate: ViewOnUpdateCallback<ViewsMap, T> = (input) => { };
	private onRemove: ViewOnRemoveCallback = () => { };
	private eventCatchers: { [K in ViewInterfaceEvents<ViewsMap, T>]?: Array<(error: Error) => void> } = {};

	constructor(executor: (resolve: () => void, reject: () => void) => ViewProxy<ViewsMap, T> | null, onUpdate: ViewOnUpdateCallback<ViewsMap, T>, onRemove: ViewOnRemoveCallback) {
		super(executor ? executor : (resolve) => {
			setTimeout(() => {
				this.resolve = resolve;
				// technically, because we're assigning this.resolve in a timeout, ViewProxy.done can be called synchronously before the timer is done.
				// in such case, ViewProxy.done flags it was called, and keep the output value - we'll immediately resolve
				if (this.doneCalled) {
					resolve(this.doneCallValue);
				}
			});
		});
		this.onUpdate = onUpdate || this.onUpdate;
		this.onRemove = onRemove || this.onRemove;
		this.eventListeners = {};
	}
	public done(output: T["output"]) {
		if (!this.resolve) {
			this.doneCalled = true;
			this.doneCallValue = output;
			return;
		}
		this.resolve(output);
	}
	public event<U extends ViewInterfaceEvents<ViewsMap, T>>(eventName: U, data: ViewInterfaceEventData<ViewsMap, T, U>) {
		if (this.removed) {
			return;
		}
		if (!this.eventListeners[eventName]) {
			return;
		}
		let result: ReturnUnpack<T["events"][U]>;
		for (const listener of this.eventListeners[eventName]) {
			const listenerResult = listener(data);
			if (listenerResult) {
				result = listenerResult;
			}
		}
		if (result) {
			return result;
		}
	}
	public on<U extends ViewInterfaceEvents<ViewsMap, T>>(eventName: U, listener: ViewInterfaceEventCallback<ViewsMap, T, U>): ViewProxy<ViewsMap, T> {
		if (this.removed) {
			return;
		}
		if (!this.eventListeners[eventName]) {
			this.eventListeners[eventName] = [];
		}
		this.eventListeners[eventName].push(listener);
		return this;
	}
	public update(params: PartialViewInterfaceInput<ViewsMap, T>) {
		if (this.removed || this.doneCalled) {
			return;
		}
		this.onUpdate(params);
	}
	public remove() {
		this.removed = true;
		this.onRemove();
		// when a view is removed, resolve the promise.
		this.done(undefined);
	}
	tryEvent<U extends ViewInterfaceEvents<ViewsMap, T>>(eventName: U, listener: ViewInterfaceEventCallback<ViewsMap, T, U>): ViewProxy<ViewsMap, T> {
		this.on(eventName, (data: ViewInterfaceEventData<ViewsMap, T, U>) => {
			try {
				return listener(data);
			} catch(e) {
				if (this.eventCatchers[eventName]) {
					this.eventCatchers[eventName].forEach((catcher) => catcher(e));
				}
			}
			});
		return this;
	}
	public catchEvent(location: ViewInterfaceEvents<ViewsMap, T>, catcher: (error: Error) => void){
		if(!this.eventCatchers[location]) {
			this.eventCatchers[location] = [];
		}
		this.eventCatchers[location].push(catcher);
	}
}
