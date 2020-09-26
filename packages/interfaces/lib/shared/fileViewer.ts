export interface FileViewerBase {
  path: string;
  isSelectingFile: boolean;
  name: string;
  onReselectFile: () => void;
}
