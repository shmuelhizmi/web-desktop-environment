import type { View } from "@react-fullstack/fullstack/shared";
import type { FileViewerBase } from "../../../shared/fileViewer";

export interface Input extends FileViewerBase {
  defaultValue: string;
  onSave: (newValue: string) => void;
}

export default interface Notepad extends View<Input> {}
