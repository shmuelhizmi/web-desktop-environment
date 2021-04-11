import Emitter from "../utils/Emitter";
import { uid } from "uid";

interface ManagerEvents {
  callFunction: {
    parameters: any[];
    name: string;
    id: string;
  };
  callEvent: {
    value: any;
    name: string;
  };
  resolveFunction: {
    value: any;
    name: string;
    id: string;
  };
}

type GetPromiseValue<Value extends any> = Value extends Promise<infer RealValue>
  ? RealValue
  : Value;

type Promisify<
  Value extends (...args: any) => any
> = ReturnType<Value> extends Promise<any>
  ? Value
  : (...args: Parameters<Value>) => Promise<ReturnType<Value>>;

abstract class ManagerBase<PublicEvents extends Record<string, any>> {
  public abstract name: string;
  public managerInternalEmitter = new Emitter<ManagerEvents>();
  private managerPublicEventsEmitter = new Emitter<PublicEvents>();
  public functionHandlers: {
    [name: string]: (...args: any) => Promise<any>;
  } = {};

  public on<
    EventName extends keyof PublicEvents,
    EventValue extends PublicEvents[EventName]
  >(name: EventName, handler: (value: EventValue) => void) {
    const remove = this.managerPublicEventsEmitter.on(name, handler).remove;
    return {
      remove: () => {
        remove();
      },
      on: this.on,
    };
  }
  public call<
    EventName extends keyof PublicEvents,
    EventValue extends PublicEvents[EventName]
  >(name: EventName, value: EventValue) {
    this.managerPublicEventsEmitter.call(name, value);
    this.managerInternalEmitter.call("callEvent", {
      name: name as string,
      value,
    });
    return this;
  }

  protected registerFunction<FunctionType extends (...args: any) => any>(
    name: string
  ) {
    const call = (
      ...parameters: Parameters<FunctionType>
    ): ReturnType<Promisify<FunctionType>> => {
      return new Promise<GetPromiseValue<ReturnType<FunctionType>>>((res) => {
        const requestId = uid();
        const requestListener = this.managerInternalEmitter.on(
          "resolveFunction",
          ({ id, name: functionName, value }) => {
            if (id === requestId && functionName === name) {
              requestListener.remove();
              res(value);
            }
          }
        );
        this.managerInternalEmitter.call("callFunction", {
          id: requestId,
          name,
          parameters,
        });
      }) as ReturnType<Promisify<FunctionType>>;
    };
    this.functionHandlers[name] = call;
    return {
      execute: ((...parameters) => {
        this.functionHandlers[name](...parameters);
      }) as Promisify<FunctionType>,
      override: (
        override: (superFunction: Promisify<FunctionType>) => FunctionType | Promisify<FunctionType>
      ) => {
        const newOverride = override(
          this.functionHandlers[name] as Promisify<FunctionType>
        );
        // this is for making sure the override return a promise
        this.functionHandlers[name] = async (...args) => newOverride(...args);
      },
    };
  }
}

export default ManagerBase;
