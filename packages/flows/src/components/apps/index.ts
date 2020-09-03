import {
	Icon,
	NativeIcon,
} from "@web-desktop-environment/interfaces/lib/shared/icon";
import Component from "@component";
import { terminal } from "@apps/utils/terminal";
import { explorer } from "@apps/utils/explorer";
import { Window } from "@web-desktop-environment/interfaces/lib/shared/window";
import { settings } from "@apps/system/settings";

export interface App<Params> {
	icon: Icon;
	nativeIcon: NativeIcon;
	name: string;
	defaultInput: Params;
	description: string;
	window: Window;
	App: new (props: Params) => Component<Params>;
}

export { terminal, explorer, settings };
