import * as React from "react";
import {
	ViewInterface,
	ParamsUnpack,
	ReturnUnpack,
	PromiseUnpacked,
} from "@web-desktop-environment/reflow/";

export type ReflowReactComponentProps<
	T extends ViewInterface<any, any, any>,
	ExternalProps = void
> = T["input"] & {
	children?: React.ReactNode[];
	event: <U extends keyof T["events"]>(
		eventName: U,
		eventData: ParamsUnpack<T["events"][U]>
	) => Promise<PromiseUnpacked<ReturnUnpack<T["events"][U]>>>;
	done: (output: T["output"]) => void;
} & ExternalProps;

export type ReflowReactComponentClass<
	T extends ViewInterface<any, any, any>,
	ExternalProps = void,
	State = never
> = React.ComponentClass<ReflowReactComponentProps<T, ExternalProps>, State>;

export type ReflowReactComponentFunction<
	T extends ViewInterface<any, any, any>,
	ExternalProps = void
> = React.FunctionComponent<ReflowReactComponentProps<T, ExternalProps>>;

export class ReflowReactComponent<
	T extends ViewInterface<any, any, any>,
	ExternalProps = void,
	State = never
> extends React.Component<ReflowReactComponentProps<T, ExternalProps>, State> {}
