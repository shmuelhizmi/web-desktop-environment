import { View } from "@react-fullstack/fullstack";

interface Document {
  name: string;
  path: string;
  value: string;
  id: number;
}

export interface Input {
  documents: Document[];
  OnSave: (parameters: {
    id: number;
    value: string;
  }) => void;
}

export default interface Notepad extends View<Input> {}
