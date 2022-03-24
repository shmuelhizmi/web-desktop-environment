import type { View } from "@react-fullstack/fullstack";

export type Input = {
  type: '3rdParty';
  https?: boolean;
  host?: string; // default is server host
  port?: number;
  path?: string; // default is none
} | {
  type: 'internal';
  id: string;
  path?: string; // default is none
}

export default interface Iframe extends View<Input> {}
