import { ReducedViewTree } from "../Reflow";
import { ViewInterface, ViewsMapInterface } from "../View";
import { ReturnUnpack, ParamsUnpack } from "../ViewProxy";

export type TransportViewEventListener = <T extends ViewInterface, U extends keyof T["events"]>(uid: string, eventName: U, eventData: ParamsUnpack<T["events"][U]>) => ReturnUnpack<T["events"][U]>;
export type TransportViewDoneListener = <T extends ViewInterface>(uid: string, output: T["output"]) => void;
export type TransportViewStackUpdateListener = (tree: ReducedViewTree<ViewsMapInterface>) => void;
export type TransportViewerParametersListener<ViewerParameters = {}> = (params: ViewerParameters) => void;
export type TransportSyncViewListener = () => void;

export abstract class ReflowTransport<ViewerParameters = {}> {
	protected viewEventListeners: Array<TransportViewEventListener> = [];
	protected viewDoneListeners: Array<TransportViewDoneListener> = [];
	protected viewStackUpdateListeners: Array<TransportViewStackUpdateListener> = [];
	protected viewerParametersListeners: Array<TransportViewerParametersListener<ViewerParameters>> = [];
	protected viewSyncListeners: Array<TransportSyncViewListener> = [];

	constructor(connectionParams: object) { }
	/**
	 * Engine side initialization. Used for initiating everything a display client may need to interact with the engine.
	 * Engine should call this method before using any engine-side functions on the instance.
	 *
	 * @returns {Promise<void>}
	 * @memberof ReflowTransport
	 */
	abstract initializeAsEngine(): Promise<void>;
	/**
	 * Send a view tree update to the display client
	 *
	 * @param {ReducedViewTree} tree The updated tree
	 * @returns {Promise<void>}
	 * @memberof ReflowTransport
	 */
	abstract sendViewTree(tree: ReducedViewTree<ViewsMapInterface>): void;
	/**
	 * Sends viewer params to the display layer
	 *
	 * @abstract
	 * @memberof ReflowTransport
	 */
	abstract sendViewerParameters(viewerParams: ViewerParameters): void;
	/**
	 * Registers an event listener on a specific view's event
	 *
	 * @param {TransportViewEventListener} listener Event callback
	 * @memberof ReflowTransport
	 */
	onViewEvent(listener: TransportViewEventListener): void {
		this.viewEventListeners.push(listener);
	}
	/**
	 * Registers a listener for views' done invocation, to get their output
	 *
	 * @param {TransportViewDoneListener} listener Callback to receive the uid and the view's output
	 * @memberof ReflowTransport
	 */
	onViewDone(listener: TransportViewDoneListener): void {
		this.viewDoneListeners.push(listener);
	}
	onViewerParameters(listener: TransportViewerParametersListener<ViewerParameters>): void {
		this.viewerParametersListeners.push(listener);
	}
	onSyncView(listener: TransportSyncViewListener): void {
		this.viewSyncListeners.push(listener);
	}

	/**
	 * Display client side initialization. Used for initiating connection with the engine transport.
	 * Display client should call this method before using any display-side functions on the instance.
	 * Implementing client class should implement this
	 *
	 * @returns {Promise<void>}
	 * @memberof ReflowTransport
	 */
	abstract initializeAsDisplay(): Promise<ReflowTransport<ViewerParameters>>;
	/**
	 * Registers a listener for view-tree updates coming from the engine
	 *
	 * @param {TransportViewStackUpdateListener} listener
	 * @memberof ReflowTransport
	 */
	onViewTree(listener: TransportViewStackUpdateListener): void {
		this.viewStackUpdateListeners.push(listener);
	}
	/**
	 * Sends a view event from the display to the engine and return last event result
	 *
	 * @template T
	 * @template U
	 * @param {string} uid
	 * @param {U} eventName
	 * @param {T["events"][U]} eventData
	 * @memberof ReflowTransport
	 */
	abstract sendViewEvent<T extends ViewInterface, U extends keyof T["events"]>(uid: string, eventName: U, eventData: ParamsUnpack<T["events"][U]>): Promise<ReturnUnpack<T["events"][U]>>;
	/**
	 * Sends a view done from the display to the engine, along with the view's output
	 *
	 * @template T
	 * @template U
	 * @param {string} uid
	 * @param {U} eventName
	 * @param {T["events"][U]} eventData
	 * @memberof ReflowTransport
	 */
	abstract sendViewDone<T extends ViewInterface>(uid: string, output: T["output"]): void;
	/**
	 * Sends a view sync request from the display to the engine, usually for initial tree
	 *
	 * @abstract
	 * @memberof ReflowTransport
	 */
	abstract sendViewSync(): void;
}
