import { lazySuspense } from "@components/suspense";

const ThemeProvider = lazySuspense(
	() => import("@views/wrapper/ThemeProvider")
);
const Window = lazySuspense(() => import("@views/native/client/Window"));

export * from "@views/apps";

export { Window, ThemeProvider };
