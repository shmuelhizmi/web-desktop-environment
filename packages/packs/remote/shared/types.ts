import { extendsViews } from "@web-desktop-environment/interfaces";
export const views = extendsViews<{
	Example: any;
}>("Example");

export type Views = typeof views;
