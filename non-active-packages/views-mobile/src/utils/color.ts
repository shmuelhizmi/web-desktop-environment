import Color from "@ctrl/tinycolor";

export const noAlpah = (color: string) => "#" + Color(color).toHex();
