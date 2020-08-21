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

export interface Download {
  file: string;
  downloadLink: string;
}

export interface Input {
  currentPath: string;
  platfromPathSperator: "/" | "\\";
  files: File[];
  downloads: Download[];
}

export interface Events {
  upload: Upload;
  createFolder: string; // path
  move: Move;
  copy: Move;
  delete: string; //path
  requestDownload: string; // path
  changeCurrentPath: string; //path
}

export interface Output {}

export default interface Explorer
  extends ViewInterface<Input, Events, Output> {}
