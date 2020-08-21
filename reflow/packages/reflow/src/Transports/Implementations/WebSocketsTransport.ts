import { ReflowTransport } from "../ReflowTransport";
import { ReducedViewTree } from "../../Reflow";
import { ViewInterface, ViewsMapInterface } from "../../View";
import { Server } from "net";
import ServerSocket from "socket.io";
import ClientSocket from "socket.io-client";
import { ReturnUnpack, PromiseUnpacked, ParamsUnpack } from "../../ViewProxy";

interface WebSocketConnectionOptions {
  host?: string;
  port?: number;
  path?: string;
}

export default class WebSocketsTransport<
  ViewerParameters = {}
> extends ReflowTransport<ViewerParameters> {
  private __connectionOptions: WebSocketConnectionOptions;
  private __socket: ServerSocket | ClientSocket;
  private __server?: Server;
  private requestIndex: number = 0;
  constructor(
    connectionOptions: WebSocketConnectionOptions | undefined = {},
    server?: Server
  ) {
    super(connectionOptions);
    this.__connectionOptions = connectionOptions;
    this.__socket = null;
    this.__server = server;
  }

  initializeAsEngine() {
    const { port = 3000, path = "" } = this.__connectionOptions || {};
    if (this.__server) {
      this.__socket = require("socket.io")(this.__server, { path });
    } else {
      const server = require("http").createServer();
      this.__socket = require("socket.io")(server, { path });
      server.listen(port);
    }
    this.__socket.on("connection", (socket) => {
      socket
        .on(
          "view_event",
          <T extends ViewInterface, U extends keyof T["events"]>({
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
            }
            if (result) {
              if (Promise.resolve(result) === result) {
                const promiseResult = result as Promise<
                  PromiseUnpacked<typeof result>
                >;
                promiseResult
                  .then((eventResult) => {
                    socket.emit("view_event_result", {
                      uid,
                      requestId,
                      eventResult,
                    });
                  })
                  .catch(() => {
                    socket.emit("view_event_result", { uid, requestId });
                  });
              } else {
                socket.emit("view_event_result", {
                  uid,
                  requestId,
                  eventResult: result,
                });
              }
            } else {
              socket.emit("view_function_result", { uid, requestId });
            }
          }
        )
        .on("view_done", ({ uid, output }) => {
          for (const listener of this.viewDoneListeners) {
            listener(uid, output);
          }
        })
        .on("view_sync", (n) => {
          for (const listener of this.viewSyncListeners) {
            listener();
          }
        });
    });
    return Promise.resolve();
  }
  initializeAsDisplay() {
    const io = require("socket.io-client");
    const { host = "localhost", port = 3000, path = "" } =
      this.__connectionOptions || {};
    const socket = io(`http://${host}:${port}`, { path });
    this.__socket = socket;
    socket
      .on("connect", () => {
        this.sendViewSync();
      })
      .on("view_tree", ({ tree }) => {
        for (const listener of this.viewStackUpdateListeners) {
          listener(tree);
        }
      })
      .on("viewer_parameters", ({ parameters }) => {
        for (const listener of this.viewerParametersListeners) {
          listener(parameters);
        }
      });
    return Promise.resolve(this);
  }
  sendViewSync() {
    this.__socket.emit("view_sync", {});
  }
  sendViewTree(tree: ReducedViewTree<ViewsMapInterface>) {
    this.__socket.emit("view_tree", { tree });
  }
  sendViewEvent<T extends ViewInterface, U extends keyof T["events"]>(
    uid: string,
    eventName: U,
    eventData: ParamsUnpack<T["events"][U]>
  ): Promise<ReturnUnpack<T["events"][U]>> {
    this.requestIndex++;
    const requestId = this.requestIndex;
    return new Promise<ReturnUnpack<T["events"][U]>>((resolve) => {
      this.__socket.on(
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
      this.__socket.emit("view_event", {
        uid,
        requestId,
        eventName,
        eventData,
      });
    });
  }
  sendViewerParameters(viewerParameters: ViewerParameters): void {
    this.__socket.emit("viewer_parameters", { parameters: viewerParameters });
  }
  sendViewDone<T extends ViewInterface>(
    uid: string,
    output: T["output"]
  ): void {
    this.__socket.emit("view_done", { uid, output });
  }
}
