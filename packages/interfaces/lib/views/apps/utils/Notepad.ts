import { View } from "@react-fullstack/fullstack";

export interface Input {
  path: string;
  name: string;
  defaultValue: string;
  isSelectingFile: boolean;
  onSave: (newValue: string) => void;
  onReselectFile: () => void;
}

export default interface Notepad extends View<Input> {}
