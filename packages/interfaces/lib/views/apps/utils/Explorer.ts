import { ViewInterface } from "@mcesystems/reflow";

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

export interface Dowmload {
  file: string;
  downloadLink: string;
}

export interface Input {
  currentPath: string;
  platfromPathSperator: "/" | "\\";
  files: File[];
  downloads: Dowmload[];
}

export interface Events {
  upload: Upload;
  createFolder: string; // name
  move: Move;
  delete: string; //name
  requestDownload: string; // name
  changeCurrentPath: string; //path
}

export interface Output {}

export default interface Explorer
  extends ViewInterface<Input, Events, Output> {}
