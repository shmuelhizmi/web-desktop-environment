import { View } from "@react-fullstack/fullstack";

export interface AboutProps {
  image: string;
  title: string;
  info: string[];
  onClose(): void;
}

export default interface About extends View<AboutProps> {}
