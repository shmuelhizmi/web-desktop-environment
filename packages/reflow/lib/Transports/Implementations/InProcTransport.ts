import { ReflowTransport } from "../ReflowTransport";
import { ReducedViewTree } from "../../Reflow";
import { ViewInterface, ViewsMapInterface } from "../../View";
import { ReturnUnpack, ParamsUnpack } from "../../ViewProxy";


export default class InProcTransport<ViewerParameters = {}> extends ReflowTransport<ViewerParameters> {
	initializeAsEngine() {
		return Promise.resolve();
	}
	initializeAsDisplay() {
		return new Promise<InProcTransport<ViewerParameters>>((resolve) => {
			this.sendViewSync();
			resolve(this);
		});
	}
	sendViewTree(tree: ReducedViewTree<ViewsMapInterface>) {
		for (const listener of this.viewStackUpdateListeners) {
			listener(JSON.parse(JSON.stringify(tree)));
		}
	}
	sendViewEvent<T extends ViewInterface, U extends keyof T["events"]>(uid: string, eventName: U, eventData: ParamsUnpack<T["events"][U]>): Promise<ReturnUnpack<T["events"][U]>> {
		return new Promise<ReturnUnpack<T["events"][U]>>((resolve) => {
			let result: ReturnUnpack<T["events"][U]>;
			for (const listener of this.viewEventListeners) {
				const listenerResult = listener(uid, eventName, eventData);
				if (listenerResult) {
				result = listenerResult;
			}
		}
		if (result) {
			resolve(result);
		} else {
			resolve()
		}
	});
	}
	sendViewDone<T extends ViewInterface>(uid: string, output: T["output"]): void {
		for (const listener of this.viewDoneListeners) {
			listener(uid, output);
		}
	}
	sendViewerParameters(viewerParams: ViewerParameters): void {
		for (const listener of this.viewerParametersListeners) {
			listener(viewerParams);
		}
	}
	sendViewSync() {
		for (const listener of this.viewSyncListeners) {
			listener();
		}
	}
}
