import Emitter from '../utils/Emitter'
import { uid } from 'uid'

interface ManagerEvents {
	callFunction: {
		parameters: any[];
		name: string;
		id: string;
	};
	resolveFunction: {
		value: any;
		name: string;
		id: string;
	};
}

type GetPromiseValue<Value extends Promise<any>> = Value extends Promise<infer RealValue> ? RealValue : Value;

abstract class ManagerBase {
	public abstract name: string;
	public managerEmitter = new Emitter<ManagerEvents>();
	public functionHandlers: { [name: string]: (...args: any) => Promise<any> } = {};
	protected registerFunction<FunctionType extends (...args: any) => Promise<any>>(name: string) {
		const call = (...parameters: Parameters<FunctionType>): ReturnType<FunctionType> => {
			return new Promise<GetPromiseValue<ReturnType<FunctionType>>>((res) => {
				const requestId = uid();
				const requestListener = this.managerEmitter.on("resolveFunction", ({ id, name: functionName, value }) => {
					if (id === requestId && functionName === name) {
						requestListener.remove();
						res(value);
					}
				})
				this.managerEmitter.call("callFunction", { id: requestId, name, parameters });
			}) as ReturnType<FunctionType>;
		}
		this.functionHandlers[name] = call;
		return {
			execute: ((...parameters) => {this.functionHandlers[name](...parameters)}) as FunctionType,
			override: (override: (superFunction: FunctionType) => FunctionType) => {
				this.functionHandlers[name] = override(this.functionHandlers[name] as FunctionType);
			}
		}
	}
}

export default ManagerBase;