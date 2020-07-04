import { ViewInterface } from "@mcesystems/reflow";

export interface Input {
  port: number;
}

export interface Events {
}

export interface Output {
}

export default interface Desktop extends ViewInterface<Input, Events, Output> {}
