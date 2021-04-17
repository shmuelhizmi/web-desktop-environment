import type * as FcIcons from "react-icons/fc";
import type * as VSCIcons from "react-icons/vsc";

export type IconNames = keyof typeof FcIcons | keyof typeof VSCIcons;

export type NativeIconTypes =
  | "AntDesign"
  | "Entypo"
  | "EvilIcons"
  | "Feather"
  | "FontAwesome"
  | "FontAwesome5"
  | "Fontisto"
  | "Foundation"
  | "Ionicons"
  | "MaterialCommunityIcons"
  | "MaterialIcons"
  | "Octicons"
  | "SimpleLineIcons"
  | "Zocial"

export type Icon =
  | {
      icon: IconNames;
      type: "icon";
    }
  | {
      icon: string;
      type: "img";
    };

export type NativeIcon = { type: NativeIconTypes; icon: string; };
