import { lazySuspense } from "@components/suspense";
export * from "@views/apps";

const Window = lazySuspense(() => import("@views/Window"));
const Service = lazySuspense(() => import("./Service"));
export { Window, Service };
