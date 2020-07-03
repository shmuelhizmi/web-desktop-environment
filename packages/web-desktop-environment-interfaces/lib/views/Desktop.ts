import { ViewInterface } from "@mcesystems/reflow";

export interface Input {
    background: string;
    apps: string[];
}

export interface Events {
	setBackground: {
		background: string;
    };
    launchApp: {
        flow: string;
        params: any;
    }
}

export interface Output {
	myOutProp: boolean;
}

export default interface Desktop extends ViewInterface<Input, Events, Output> { }