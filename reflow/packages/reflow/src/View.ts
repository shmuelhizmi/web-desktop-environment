export interface ViewInterface<Input extends object = {}, Events extends object = {}, Output extends any = void> {
	input: Input;
	output: Output;
	events: Events;
}

export interface ViewsMapInterface {
	[key: string]: ViewInterface<any, any, any>;
}
