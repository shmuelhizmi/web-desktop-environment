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

export type EntryPointProps = {
  packageBaseline: string;
}

// to avoid no export errors
export default {};