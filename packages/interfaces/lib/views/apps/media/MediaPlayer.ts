import { View } from "@react-fullstack/fullstack";
import { FileViewerBase } from "../../../shared/fileViewer";

export interface Input extends FileViewerBase {
  source: string;
  port: number;
}

export default interface MediaPlayer extends View<Input> {}
