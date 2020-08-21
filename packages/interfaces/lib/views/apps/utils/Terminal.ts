import { ViewInterface } from "@web-desktop-environment/reflow";

export interface Input {
  port: number;
}

export interface Events {
}

export interface Output {
}

export default interface Terminal extends ViewInterface<Input, Events, Output> {}
