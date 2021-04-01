import { View } from "@react-fullstack/fullstack";

type LoadingVariants = "water" | "jumpCube";

export interface Input {
  message: string;
  variant: LoadingVariants;
}

export default interface LoadingScreenViewView
  extends View<Input> {}
