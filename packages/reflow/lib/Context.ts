import { v4 } from 'uuid'

export class Context<T> {
	public readonly uid: string;
	constructor() {
		this.uid = v4();
	}
}

export function createContext<T>() {
	return new Context<T>();
}