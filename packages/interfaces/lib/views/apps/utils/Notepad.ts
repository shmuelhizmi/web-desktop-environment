import { ViewInterface } from "@mcesystems/reflow";

interface Document {
  name: string;
  path: string;
  value: string;
  id: number;
}

export interface Input {
  documents: Document[];
}

export interface Events {
  save: {
    id: number;
    value: string;
  };
}

export interface Output {}

export default interface Notepad extends ViewInterface<Input, Events, Output> {}
