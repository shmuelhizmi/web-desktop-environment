import type { View } from "@react-fullstack/fullstack";

export interface File {
  isFolder: boolean;
  name: string;
  size?: number;
  time?: number;
}

export interface Upload {
  data: string;
  path: string;
}

export interface Move {
  originalPath: string;
  newPath: string;
}
export type ExplorerViewType = "explore" | "select-file" | "select-folder";

export interface Input {
  type: ExplorerViewType;
  currentPath: string;
  platformPathSeparator: "/" | "\\";
  files: File[];
  onUpload: (upload: Upload) => void;
  onCreateFolder: (path: string) => void;
  onOpen: (path: string) => void;
  onCreateFile: (path: string) => void;
  onMove: (parameters: Move) => void;
  onCopy: (parameters: Move) => void;
  onDelete: (path: string) => void;
  onRequestDownloadLink: (path: string) => Promise<{ path: string; port: number; }>; // download link
  onChangeCurrentPath: (path: string) => void;
  onSelect?: (path: string) => void;
}

export default interface Explorer
  extends View<Input> {}
