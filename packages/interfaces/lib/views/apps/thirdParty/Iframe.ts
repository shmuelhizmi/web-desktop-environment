import { View } from "@react-fullstack/fullstack";

export interface Input {
  https?: boolean;
  host?: string; // default is server host
  port: number;
  path?: string; // default is none
}

export default interface Iframe extends View<Input> {}
