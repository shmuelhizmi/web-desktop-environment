import { platform } from "os";

export enum OS {
	Linux = "linux",
	Window = "win32",
	Mac = "darwin",
	Other = "other",
}

export const getOS = (): OS => {
	return (platform() as OS) || OS.Other;
};
