import { View } from "@react-fullstack/fullstack";
import { FileViewerBase } from "../../../shared/fileViewer";

export interface Input extends FileViewerBase {
  defaultValue: string;
  onSave: (newValue: string) => void;
}

export default interface Notepad extends View<Input> {}
