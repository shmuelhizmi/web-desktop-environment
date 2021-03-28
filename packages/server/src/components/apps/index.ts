import {
	Icon,
	NativeIcon,
} from "@web-desktop-environment/interfaces/lib/shared/icon";
import Component from "@component";
import { terminal } from "@components/apps/utils/Terminal";
import { explorer } from "@components/apps/utils/Explorer";
import { notepad } from "@components/apps/utils/Notepad";
import { Window } from "@web-desktop-environment/interfaces/lib/shared/window";
import { settings } from "@components/apps/system/Settings";
import { mediaPlayer } from "@components/apps/media/MediaPlayer";

export interface App<Params> {
	icon: Icon;
	nativeIcon: NativeIcon;
	name: string;
	defaultInput: Params;
	description: string;
	window: Window;
	App: new (props: Params) => Component<Params>;
}

export class AppsManager {
	private static registerdApps = new Map<string, App<any>>();

	public static registerApp(apps: Record<string, App<any>>) {
		for (const appName in apps) {
			AppsManager.registerdApps.set(appName, apps[appName]);
		}
	}

	public static get apps() {
		return new Map(AppsManager.registerdApps);
	}
}

AppsManager.registerApp({ terminal, explorer, settings, notepad, mediaPlayer });
