import { ReflowTransport } from "../ReflowTransport";
import { ReducedViewTree } from "../../Reflow";
import { ViewInterface, ViewsMapInterface } from "../../View";
import { ParamsUnpack, ReturnUnpack, PromiseUnpacked } from "../../ViewProxy";

interface WorkerConnectionOptions {
  /**
   * <pre> if your using web worker please pass the Worker from the diplay layer or self from the server. </pre>
   * <pre> if your using web service please pass a the BroadcastChannel from both the diplay layer or the server. </pre>
   * <pre> if you want to use custom event based transport please pass a MessageClient. </pre>
   */
  connection: Worker | MessageClient | BroadcastChannel | Window;
}

BroadcastChannel;

interface WorkerEvent {
  name: string;
  data: any;
  source: "__internal__" | "__external__";
}

interface MessageClient {
  onmessage?: (message: { data: WorkerEvent }) => void;
  readonly postMessage: (message: WorkerEvent) => void;
}

export default class WebWorkerTransport<
  ViewerParameters = {}
> extends ReflowTransport<ViewerParameters> {
  private __worker: MessageClient = {
    postMessage: () => {
      throw new Error("can not emit to worker Reflow main flow is started.");
    },
  };

  private externalEventListeners: Record<
    string,
    ((message: WorkerEvent) => void)[]
  > = {};
  private internalEventListeners: Record<
    string,
    ((message: WorkerEvent) => void)[]
  > = {};

  private requestIndex: number = 0;

  constructor(connectionOptions: WorkerConnectionOptions) {
    super(connectionOptions);
    this.__worker = (connectionOptions.connection as unknown) as MessageClient;
  }

  public addWorkerEventListener = (
    event: string,
    handler: (data: any) => void
  ) => {
    if (!this.externalEventListeners[event]) {
      this.externalEventListeners[event] = [];
    }
    this.externalEventListeners[event].push(handler);
  };

  private addInternalWorkerEventListener = (
    event: string,
    handler: (data: any) => void
  ) => {
    if (!this.internalEventListeners[event]) {
      this.internalEventListeners[event] = [];
    }
    this.internalEventListeners[event].push(handler);
  };

  public removeWorkerEventListener = (
    event: string,
    handler: (data: any) => void
  ) => {
    if (!this.externalEventListeners[event]) {
      this.externalEventListeners[event] = [];
    }
    this.externalEventListeners[event] = this.externalEventListeners[
      event
    ].filter((currentHandler) => currentHandler !== handler);
  };

  public removeInternalWorkerEventListener = (
    event: string,
    handler: (data: any) => void
  ) => {
    if (!this.internalEventListeners[event]) {
      this.internalEventListeners[event] = [];
    }
    this.internalEventListeners[event] = this.internalEventListeners[
      event
    ].filter((currentHandler) => currentHandler !== handler);
  };

  public emitWorkerEvent = (event: string, data: any) => {
    this.__worker.postMessage({ name: event, source: "__external__", data });
  };

  public emitInternalWorkerEvent = (event: string, data: any) => {
    this.__worker.postMessage({ name: event, source: "__internal__", data });
  };

  private onExternalEvent = (message: WorkerEvent) => {
    if (this.externalEventListeners[message.name]) {
      this.externalEventListeners[message.name].forEach((listener) =>
        listener(message.data)
      );
    }
  };

  private onInternalEvent = (message: WorkerEvent) => {
    if (this.internalEventListeners[message.name]) {
      this.internalEventListeners[message.name].forEach((listener) =>
        listener(message.data)
      );
    }
  };

  initializeAsEngine() {
    const onViewEvent = <T extends ViewInterface, U extends keyof T["events"]>({
      uid,
      requestId,
      eventName,
      eventData,
    }: {
      uid: string;
      requestId: string;
      eventName: U;
      eventData: ParamsUnpack<T["events"][U]>;
    }) => {
      let result: ReturnUnpack<T["events"][U]>;
      for (const listener of this.viewEventListeners) {
        const listenerResult = listener(uid, eventName, eventData);
        if (listenerResult) {
          result = listenerResult;
        }
        if (result) {
          if (Promise.resolve(result) === result) {
            const promiseResult = result as Promise<
              PromiseUnpacked<typeof result>
            >;
            promiseResult
              .then((eventResult) => {
                this.emitInternalWorkerEvent("view_event_result", {
                  uid,
                  requestId,
                  eventResult,
                });
              })
              .catch(() => {
                this.emitInternalWorkerEvent("view_event_result", {
                  uid,
                  requestId,
                });
              });
          } else {
            this.emitInternalWorkerEvent("view_event_result", {
              uid,
              requestId,
              eventResult: result,
            });
          }
        } else {
          this.emitInternalWorkerEvent("view_function_result", {
            uid,
            requestId,
          });
        }
      }
    };
    const onViewDone = ({ uid, output }) => {
      for (const listener of this.viewDoneListeners) {
        listener(uid, output);
      }
    };
    const onViewSync = (n) => {
      for (const listener of this.viewSyncListeners) {
        listener();
      }
    };

    this.addInternalWorkerEventListener("view_event", onViewEvent);
    this.addInternalWorkerEventListener("view_done", onViewDone);
    this.addInternalWorkerEventListener("view_sync", onViewSync);
    this.addInternalWorkerEventListener("connect", () =>
      this.emitInternalWorkerEvent("connect", {})
    );
    this.__worker.onmessage = (message) => {
      if (message.data.source === "__internal__") {
        this.onInternalEvent(message.data);
      }
      if (message.data.source === "__external__") {
        this.onExternalEvent(message.data);
      }
    };

    return Promise.resolve();
  }
  initializeAsDisplay() {
    const onConnect = () => {
      this.sendViewSync();
    };
    const onViewTree = ({ tree }) => {
      for (const listener of this.viewStackUpdateListeners) {
        listener(tree);
      }
    };
    const onViewerParameters = ({ parameters }) => {
      for (const listener of this.viewerParametersListeners) {
        listener(parameters);
      }
    };

    this.addInternalWorkerEventListener("connect", onConnect);
    this.addInternalWorkerEventListener("view_tree", onViewTree);
    this.addInternalWorkerEventListener(
      "viewer_parameters",
      onViewerParameters
    );

    this.__worker.onmessage = (message) => {
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.data.source === "__internal__") {
        this.onInternalEvent(message.data);
      }
      if (message.data.source === "__external__") {
        this.onExternalEvent(message.data);
      }
    };
    this.emitInternalWorkerEvent("connect", {});

    return Promise.resolve(this);
  }
  sendViewSync() {
    this.emitInternalWorkerEvent("view_sync", {});
  }
  sendViewTree(tree: ReducedViewTree<ViewsMapInterface>) {
    this.emitInternalWorkerEvent("view_tree", { tree });
  }
  sendViewEvent<T extends ViewInterface, U extends keyof T["events"]>(
    uid: string,
    eventName: U,
    eventData: ParamsUnpack<T["events"][U]>
  ): Promise<ReturnUnpack<T["events"][U]>> {
    this.requestIndex++;
    const requestId = this.requestIndex;
    return new Promise<ReturnUnpack<T["events"][U]>>((resolve) => {
      this.addInternalWorkerEventListener(
        "view_event_result",
        (result: {
          uid: string;
          requestId: number;
          eventResult?: ReturnUnpack<T["events"][U]>;
        }) => {
          if ((result.uid === uid, result.requestId === requestId)) {
            resolve(result.eventResult);
          }
        }
      );
      this.emitInternalWorkerEvent("view_event", {
        uid,
        requestId,
        eventName,
        eventData,
      });
    });
  }
  sendViewerParameters(viewerParameters: ViewerParameters): void {
    this.emitInternalWorkerEvent("viewer_parameters", { parameters: viewerParameters });
  }
  sendViewDone<T extends ViewInterface>(
    uid: string,
    output: T["output"]
  ): void {
    this.emitInternalWorkerEvent("view_done", { uid, output });
  }
}
