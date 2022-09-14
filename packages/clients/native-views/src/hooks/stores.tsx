import React, { createContext, useContext, useState } from "react";

type BaseData = object | number | string | boolean | null;
type CouldBePartial<D extends BaseData> = D extends object ? Partial<D> : D;
type SetData<D extends BaseData> = (
	data: CouldBePartial<D> | ((prevData: D) => CouldBePartial<D>)
) => D;
type DataGetter<D extends BaseData> = (() => D) | D;
type Factory<D extends BaseData, I> = (get: () => D, set: SetData<D>) => I;

export function boundedObject<O extends object>(obj: O) {
	for (const key in obj) {
		const value = obj[key];
		if (typeof value === "function") {
			obj[key] = value.bind(obj);
		}
	}
	return obj;
}

export function createStore<
	Data extends object | number | string | boolean,
	Interface extends object
>(data: DataGetter<Data>, factory: Factory<Data, Interface>) {
	const context = createContext<Interface | undefined>(undefined);
	const Provider = context.Provider;
	function useStore() {
		const store = useContext(context);
		if (!store) {
			throw new Error("Store is not initialized");
		}
		return store;
	}
	function StoreProvider(props: { children: any }) {
		const [state, setState] = useState<Data>(
			typeof data === "function" ? data() : data
		);
		const store = boundedObject(
			factory(
				() => state,
				(updatedData) => {
					if (typeof updatedData === "function") {
						setState((prevData) => {
							const newData = updatedData(prevData);
							if (typeof prevData === "object" && !Array.isArray(prevData)) {
								return Object.assign({}, prevData, newData);
							}
						});
						return state;
					}
					if (typeof updatedData === "object" && !Array.isArray(updatedData)) {
						setState((prevData) => {
							return Object.assign({}, prevData, updatedData);
						});
						return state;
					}
					setState(updatedData as Data);
					return updatedData as Data;
				}
			)
		);
		return <Provider value={store}>{props.children}</Provider>;
	}
	function withStore<T extends React.ComponentType>(Component: T) {
		return (props: any) =>
			(
				<StoreProvider>
					<Component {...props} />
				</StoreProvider>
			) as unknown as T;
	}
	return [useStore, StoreProvider, withStore] as const;
}
