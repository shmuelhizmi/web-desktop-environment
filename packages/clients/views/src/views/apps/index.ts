import { lazySuspense } from "@components/suspense";

const Terminal = lazySuspense(() => import("@views/apps/utils/Terminal"));
const Explorer = lazySuspense(() => import("@views/apps/utils/Explorer"));
const Notepad = lazySuspense(() => import("@views/apps/utils/Notepad"));
//media
const MediaPlayer = lazySuspense(() => import("@views/apps/media/MediaPlayer"));

// system
const Settings = lazySuspense(() => import("@views/apps/system/Settings"));

// thirdParty
const Iframe = lazySuspense(() => import("@views/apps/thirdParty/Iframe"));

// shared
const LoadingScreen = lazySuspense(
	() => import("@views/apps/shared/LoadingScreen")
);

export {
	Terminal,
	Explorer,
	Settings,
	Notepad,
	MediaPlayer,
	Iframe,
	LoadingScreen,
};
