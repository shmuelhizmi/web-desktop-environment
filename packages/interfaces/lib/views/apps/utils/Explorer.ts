import { ViewInterface } from "@web-desktop-environment/reflow";

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
type ExplorerViewType = "explore" | "select-file" | "select-folder";

export interface Input {
  type: ExplorerViewType;
  currentPath: string;
  platfromPathSperator: "/" | "\\";
  files: File[];
}

export interface Events {
  upload: Upload;
  createFolder: string; // path
  move: Move;
  copy: Move;
  delete: string; //path
  requestDownloadLink: (path: string) => Promise<{ path: string; port: number; }>; // download link
  changeCurrentPath: string; //path
}

export interface Output {
  type: ExplorerViewType;
  result?: string; // path
}

export default interface Explorer
  extends ViewInterface<Input, Events, Output> {}
