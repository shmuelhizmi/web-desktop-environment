import { ViewInterface } from "@mcesystems/reflow";
import { Settings } from "../../../shared/settings";
import { PartialPartial } from "../../../shared/types";

interface SystemInformation {
  cpu: {
    manufacturer: string; // e.g. 'Intel(R)'
    brandName: string; // e.g. 'Core(TM)2 Duo'
    speed: string; // in GHz e.g. '3.40'
    speedMin: string;
    speedMax: string;
    cores: number;
    physicalCores: number;
  };
  ram: {
    totalInGabytes: number;
    freeInGabytes: number;
  };
  disks: {
    name: string;
    vendor: string;
    totalInGabytes: number;
  }[];
  os: {
    platform: string; // e.g. 'linux' or 'win32'
    kernel: string;
    hostname: string;
  };
}

export interface Input {
  settings: Settings;
  systemInfo?: PartialPartial<SystemInformation>;
}

export interface Events {
  reload: null;
  setSettings: Settings;
}

export interface Output {}

export default interface Settings
  extends ViewInterface<Input, Events, Output> {}
