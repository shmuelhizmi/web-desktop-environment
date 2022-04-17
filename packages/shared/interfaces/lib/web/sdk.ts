declare global {
  interface Window {
    wdeSdk: SDK;
  }
}

export type SDK = {
  readonly host: string;
  readonly port: number;
  readonly token: string;
  readonly https: boolean;
};
