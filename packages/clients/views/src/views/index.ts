import { lazySuspense } from '@components/suspense';

const ThemeProvider = lazySuspense(() => import("@views/wrapper/ThemeProvider"));
const Desktop = lazySuspense(() => import("@views/Desktop"));
const Window = lazySuspense(() => import("@views/Window"));

export * from "@views/apps";

export { Desktop, Window, ThemeProvider };
