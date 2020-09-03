import { View } from "@react-fullstack/fullstack";

export interface Input {
  port: number;
}

export default interface Terminal extends View<Input> {}
