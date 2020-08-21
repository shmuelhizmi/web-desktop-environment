import {
	Icon,
	NativeIcon,
} from "@web-desktop-environment/interfaces/lib/shared/icon";
import { Flow } from "@web-desktop-environment/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces/lib";
import { terminal } from "@apps/utils/terminal";
import { explorer } from "@apps/utils/explorer";
import { Window } from "@web-desktop-environment/interfaces/lib/shared/window";
import { settings } from "@apps/system/settings";
import { defaultFlowInput } from "@managers/desktopManager";

interface AppEvents {
	change_title: string;
}

export interface App<Params> {
	icon: Icon;
	nativeIcon: NativeIcon;
	name: string;
	defaultInput: Params;
	description: string;
	window: Window;
	flow: Flow<
		ViewInterfacesType,
		Params & defaultFlowInput,
		void,
		null,
		null,
		AppEvents
	>;
}

export { terminal, explorer, settings };
