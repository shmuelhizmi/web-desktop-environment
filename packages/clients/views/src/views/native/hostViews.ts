import { lazySuspense } from '@components/suspense';
const ThemeProvider = lazySuspense(() => import("@views/wrapper/ThemeProvider"));
const Desktop = lazySuspense(() => import("@views/native/host/Desktop"));
const Window = lazySuspense(() => import("@views/native/host/Window"));

export * from "@views/apps";

export { Desktop, Window, ThemeProvider };
