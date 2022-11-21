import type { View } from "@react-fullstack/fullstack/shared";

export interface Input {
  id: string;
}

export default interface Terminal extends View<Input> {}
