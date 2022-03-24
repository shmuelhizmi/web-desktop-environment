import type { View } from "@react-fullstack/fullstack";
import type { FileViewerBase } from "../../../shared/fileViewer";

export interface Input extends FileViewerBase {
  source: string;
  downloadServerDomain: string;
}

export default interface MediaPlayer extends View<Input> {}
