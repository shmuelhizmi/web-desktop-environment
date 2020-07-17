import type * as Icons from "react-icons/all";

export type IconNames = keyof typeof Icons;

export type Icon =
  | {
      icon: IconNames;
      type: "icon";
    }
  | {
      icon: string;
      type: "img";
    };
