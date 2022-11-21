import type { View } from "@react-fullstack/fullstack/shared";

type LoadingVariants = "water" | "jumpCube";

export interface Input {
  message: string;
  variant: LoadingVariants;
}

export default interface LoadingScreenViewView
  extends View<Input> {}
