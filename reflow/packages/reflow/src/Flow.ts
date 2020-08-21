
import { FlowToolkit } from "./index";
import { ViewsMapInterface } from "./View";

export class ActionPromise<T> extends Promise<T> {
	onCanceled: (cb: () => void) => ActionPromise<T>;
	cancel: () => void;
}

export enum FlowRoutingEntryType {
	Step,
	Back
}

export interface FlowRoutingEntry {
	type: FlowRoutingEntryType;
}

export interface FlowRoutingStep<T> extends FlowRoutingEntry {
	type: FlowRoutingEntryType.Step;
	handler: () => Promise<T>;
	onResolved: (result: T) => void
	name?: string;
}

export interface FlowRoutingBack extends FlowRoutingEntry {
	type: FlowRoutingEntryType.Back;
	id?: string;
}

export type FlowRoute = FlowRoutingEntry[];

export type FlowEventsDescriptor = object;
export type FlowEventListener<Events extends FlowEventsDescriptor, T extends keyof Events> = (data: Events[T]) => void;
export type FlowEventsEmitter<Events extends FlowEventsDescriptor> = <T extends keyof Events>(eventName: T, data: Events[T]) => void;
export type FlowEventRegisterer<Events extends FlowEventsDescriptor> = <T extends keyof Events>(eventName: T, listener?: FlowEventListener<Events, T>) => Promise<Events[T]>;
export type FlowEventRemover<Events extends FlowEventsDescriptor> = <T extends keyof Events>(eventName: T, listener?: FlowEventListener<Events, T>) => void;
export type FlowAction = <T>(action: Promise<T>) => ActionPromise<T>;
export type FlowStepRegisterer = <T>(handler: () => Promise<T>, name?: string) => T;
export type FlowBackPointRegisterer = (id?: string) => void;
export type FlowBack = (id?: string) => void;

export type Flow<ViewsMap extends ViewsMapInterface, Input extends any = void, Output extends any = void, State extends object = {}, Notifications extends FlowEventsDescriptor = {}, Events extends FlowEventsDescriptor = {}> =
	(toolkit: FlowToolkit<ViewsMap> & {
		input: Input,
		state: State,
		event: FlowEventsEmitter<Events>,
		on: FlowEventRegisterer<Notifications>,
		off: FlowEventRemover<Notifications>,
		action: FlowAction,
		onCanceled: (cb: () => void) => void,
		cancel: () => void,
		step: FlowStepRegisterer,
		backPoint: FlowBackPointRegisterer,
		back: FlowBack,
		backOutput: (output: Output) => void;
	}) => Promise<Output>;

export class CancellationError { }

export interface FlowOptions {
	autoStart: boolean;
}

let tmpResolve = null;
let tmpReject = null;
export class FlowProxy<ViewsMap extends ViewsMapInterface, Input extends any = void, Output extends any = void, State extends object = {}, Notifications extends FlowEventsDescriptor = {}, Events extends FlowEventsDescriptor = {}> extends Promise<Output> {
	private resolve: (output: Output) => void = () => { };
	private reject: (err?) => void = () => { };
	private notificationListeners: { [T in keyof Notifications]?: Array<FlowEventListener<Notifications, T>> } = {};
	private eventListeners: { [T in keyof Events]?: Array<FlowEventListener<Events, T>> } = {};
	private cancellationPromise: Promise<CancellationError>;
	private cancellationPromiseEmitters: Array<() => void> = [];
	private doCancelFlow: () => void;
	private childFlows: Array<FlowProxy<ViewsMap, any, any, any, any, any>> = [];

	private flowRouteRunning: boolean = false;
	private flowRouteCurrentEntryIndex: number = -1;
	private flowRouteContinuePromiseResolver: (shouldBreak: boolean) => void;
	private flowRoute: FlowRoute = [];
	private backOutput: Output | undefined;
	private currentStepActions: ActionPromise<any>[] = [];

	public flowProcedure: Flow<ViewsMap, Input, Output>;
	public toolkit: FlowToolkit<ViewsMap>;
	public state: State;
	public input: Input;
	constructor(executor: (resolve: () => void, reject: () => void) => FlowProxy<ViewsMap, Input, Output, State, Notifications, Events> | null, flowProc: Flow<ViewsMap, Input, Output, State>, toolkit: FlowToolkit<ViewsMap>, input?: Input, state?: State, options?: FlowOptions) {
		super(executor ? executor : (resolve, reject) => {
			tmpResolve = resolve;
			tmpReject = reject;
		});
		let main = false;
		if (tmpResolve && tmpReject) {
			main = true;
			// this is a hack, counting on javascript runtime being single threaded
			// super is called synchronously, so two FlowProxy constructors can't be called together, affecting the resolve member of on another through the global tmpResolve variable
			this.resolve = tmpResolve.bind(this);
			this.reject = tmpReject.bind(this);
			tmpResolve = null;
			tmpReject = null;
		}

		this.flowProcedure = flowProc;
		this.toolkit = toolkit;
		this.state = state;
		this.input = input;

		this.event = this.event.bind(this);
		this.action = this.action.bind(this);
		this.onNotification = this.onNotification.bind(this);
		this.offNotification = this.offNotification.bind(this);
		this.notify = this.notify.bind(this);
		this.cancel = this.cancel.bind(this);
		this.onCanceled = this.onCanceled.bind(this);
		this.step = this.step.bind(this);
		this.back = this.back.bind(this);
		this.backPoint = this.backPoint.bind(this);
		this.setBackOutput = this.setBackOutput.bind(this);

		if (main) {
			this.hookFlowFunction();
			this.cancellationPromise = new Promise((resolve) => {
				this.doCancelFlow = () => {
					for (const cb of this.cancellationPromiseEmitters) {
						cb();
					}
					// cancel all child flows
					this.cancelChildFlows();
					resolve(new CancellationError());
				};
			});
			const { autoStart = true } = options || {};
			if (autoStart) {
				this.executeFlowProc();
			}
		}
	}
	private cancelChildFlows() {
		for (const childFlow of this.childFlows) {
			childFlow.cancel();
		}
	}
	private executeFlowProc() {
		return this.flowProcedure(Object.assign({}, this.toolkit, {
			input: this.input,
			state: this.state,
			event: this.event,
			on: this.onNotification,
			off: this.offNotification,
			action: this.action,
			cancel: this.cancel,
			onCanceled: this.onCanceled,
			step: this.step as FlowStepRegisterer,
			backPoint: this.backPoint,
			backOutput: this.setBackOutput,
			back: this.back,
		})).then(this.resolve, this.reject).catch(() => { }).then(() => {
			// cancel child flow if any left
			this.cancelChildFlows();
		});
	}
	private hookFlowFunction() {
		// hook on the toolkit flow() function so we can track child processes, and cancel them when this instance is canceled
		const originalFlowFn = this.toolkit.flow;
		this.toolkit.flow = (flow, input?, viewParent?, options?) => {
			const childFlowProxy = originalFlowFn(flow, input, viewParent, options);
			this.childFlows.push(childFlowProxy);
			childFlowProxy.catch(() => { }).then(() => {
				const idx = this.childFlows.indexOf(childFlowProxy);
				if (-1 === idx) {
					return;
				}
				this.childFlows.splice(idx, 1);
			});
			return childFlowProxy;
		};
	}
	private dispatchEvent(listenersMap: object, eventName: string | number | symbol, data: any) {
		if (!listenersMap[eventName]) {
			return;
		}

		// Making a copy since listeners might mess with the map (see @registerEventListener) which might mess up our iteration
		const listeners = [...listenersMap[eventName]];
		for (const listener of listeners) {
			listener(data);
		}
	}
	private registerEventListener<T extends FlowEventsDescriptor, U extends keyof T>(listenersMap: object, eventName: string | number | symbol, listener?: (data) => void): Promise<T[U]> {
		if (!listenersMap[eventName]) {
			listenersMap[eventName] = [];
		}
		if (!listener) {
			return new Promise((resolve) => {
				const promiseListener = (data) => {
					this.removeEventListener(listenersMap, eventName, promiseListener);
					resolve(data);
				};
				this.registerEventListener(listenersMap, eventName, promiseListener);
			});
		}
		listenersMap[eventName].push(listener);
	}
	private removeEventListener(listenersMap: object, eventName: string | number | symbol, listener?: (data) => void) {
		if (!listenersMap[eventName]) {
			return;
		}
		if (!listener) {
			delete listenersMap[eventName];
			return;
		}

		const listeners = [...listenersMap[eventName]];
		for (const i in listeners) {
			if (listener === listenersMap[eventName][i]) {
				listenersMap[eventName].splice(i, 1);
			}
		}
	}
	private action<T>(action: Promise<T>): ActionPromise<T> {
		let cancellationPromiseEmitter;
		// actions can be either fulfilled with original promise result, canceled becasue:
		// 1. flow was cancelled
		// 2. specifically cancelling this specific action
		let specificActionCancellationListener: () => void;
		const specificActionCancellationPromise = new Promise((resolve) => {
			specificActionCancellationListener = () => {
				resolve(new CancellationError());
			}
		})
		const racingPromise = <ActionPromise<T>>Promise.race([specificActionCancellationPromise, this.cancellationPromise, action]).then((res) => {
			if (cancellationPromiseEmitter) {
				const idx = this.cancellationPromiseEmitters.indexOf(cancellationPromiseEmitter);
				if (-1 !== idx) {
					this.cancellationPromiseEmitters.splice(idx, 1);
				}
				cancellationPromiseEmitter = null;
			}
			const currentStepActionIdx = this.currentStepActions.indexOf(racingPromise)
			if (-1 !== currentStepActionIdx) {
				this.currentStepActions.splice(currentStepActionIdx, 1)
			}
			if (!(res instanceof CancellationError)) {
				return res;
			}
			// if flow was canceled return a never-ending promise;
			return new Promise(() => { });
		});

		racingPromise.onCanceled = (cb) => {
			cancellationPromiseEmitter = cb;
			this.cancellationPromiseEmitters.push(cancellationPromiseEmitter);
			return racingPromise;
		};

		racingPromise.cancel = () => {
			if (specificActionCancellationListener) {
				specificActionCancellationListener();
			}
		}

		this.currentStepActions.push(racingPromise);

		return racingPromise;
	}
	private async startFlowRoute() {
		if (this.flowRouteRunning) {
			return;
		}
		this.flowRouteRunning = true;
		if (-1 === this.flowRouteCurrentEntryIndex) {
			this.flowRouteCurrentEntryIndex = 0;
		}
		for (; (-1 !== this.flowRouteCurrentEntryIndex) && (this.flowRouteCurrentEntryIndex < this.flowRoute.length); this.flowRouteCurrentEntryIndex++) {
			const entry = this.flowRoute[this.flowRouteCurrentEntryIndex];
			if (FlowRoutingEntryType.Step !== entry.type) {
				continue;
			}
			const { handler, onResolved } = (<FlowRoutingStep<any>>entry);
			const continuePromise = new Promise<boolean>((resolve) => {
				this.flowRouteContinuePromiseResolver = resolve;
			});
			this.currentStepActions.splice(0);
			const { shouldContinue, shouldBreak, data } = await Promise.race([
				continuePromise.then((shouldBreak) => ({ shouldContinue: true, shouldBreak, data: null })),
				handler().then((data) => ({ shouldContinue: false, shouldBreak: false, data }))
			]);
			if (shouldContinue || shouldBreak) {
				for (const action of this.currentStepActions) {
					action.cancel();
				}
			} else {
				onResolved(data);
			}
			this.currentStepActions.splice(0);
			if (shouldBreak) {
				break;
			}
			if (shouldContinue) {
				continue;
			}
		}
		this.flowRouteRunning = false;
	}
	private step<T>(handler: () => Promise<T>, name?: string) {
		return new Promise((resolve) => {
			this.flowRoute.push(<FlowRoutingStep<T>>{
				type: FlowRoutingEntryType.Step,
				handler,
				name,
				onResolved: (res) => {
					resolve(res);
				}
			});
			this.startFlowRoute();
		});

	}
	private backPoint(id?: string) {
		if (id && this.flowRoute.find(entry => FlowRoutingEntryType.Back === entry.type && id === (<FlowRoutingBack>entry).id)) {
			throw new Error("backPoint() was called with id that already exists");
		}
		this.flowRoute.push(<FlowRoutingBack>{
			type: FlowRoutingEntryType.Back,
			id,
		});
	}
	private setBackOutput(output: Output) {
		this.backOutput = output;
	}
	start() {
		this.executeFlowProc();
	}
	notify<T extends keyof Notifications>(eventName: T, data: Notifications[T]): void {
		this.dispatchEvent(this.notificationListeners, eventName, data);
	}
	onNotification<T extends keyof Notifications>(eventName: T, listener?: FlowEventListener<Notifications, T>): Promise<Notifications[T]> {
		return this.registerEventListener<Notifications, T>(this.notificationListeners, eventName, listener);
	}
	offNotification<T extends keyof Notifications>(eventName: T, listener: FlowEventListener<Notifications, T>) {
		this.removeEventListener(this.notificationListeners, eventName, listener);
	}
	event<T extends keyof Events>(eventName: T, data: Events[T]) {
		this.dispatchEvent(this.eventListeners, eventName, data);
	}
	on<T extends keyof Events>(eventName: T, listener?: FlowEventListener<Events, T>): Promise<Events[T]> {
		return this.registerEventListener<Events, T>(this.eventListeners, eventName, listener);
	}
	off<T extends keyof Events>(eventName: T, listener: FlowEventListener<Events, T>) {
		this.removeEventListener(this.eventListeners, eventName, listener);
	}
	cancel() {
		this.doCancelFlow();
		this.reject(new CancellationError());
	}
	onCanceled(cb: () => void) {
		this.cancellationPromiseEmitters.push(cb);
	}
	back(id?: string) {
		let backEntryIndex = -1;
		if (id) {
			backEntryIndex = this.flowRoute.findIndex(entry => {
				if (FlowRoutingEntryType.Back !== entry.type) {
					return false;
				}
				return id === (<FlowRoutingBack>entry).id
			});
			if (-1 === backEntryIndex) {
				throw new Error("called back() with id, but couldn't find this back-point");
			}
		} else {
			// search for the previous back point - always search for the back entry before this.flowRouteCurrentEntryIndex
			// and then search for the one before that - this is to ensure we're not always returning to the same point
			// if non found - resolve
			let foundFirst = false;
			for (let i = this.flowRouteCurrentEntryIndex - 1; i >= 0; i--) {
				if (FlowRoutingEntryType.Back !== this.flowRoute[i].type) {
					continue;
				}
				if (!foundFirst) {
					foundFirst = true;
					continue;
				}
				backEntryIndex = i;
				break;
			}
		}

		if (-1 === backEntryIndex) {
			// in case the flow route is running - resolve the route promise in a breaking mode
			this.flowRouteContinuePromiseResolver(true);
			this.flowRouteCurrentEntryIndex = -1;
			// cancel flow if resolving because of back
			this.doCancelFlow();
			this.resolve(this.backOutput);
			return;
		}
		// in case the flow route is running - resolve the route promise in a continuing mode
			this.flowRouteContinuePromiseResolver(false);
		this.flowRouteCurrentEntryIndex = backEntryIndex;
		this.startFlowRoute();
	}
}
