import { startServer } from "@web-desktop-environment/server";
import { AppsManager } from "@web-desktop-environment/server/lib/components/apps";
import { vscode } from "./components/apps/VisualStudioCode";

AppsManager.registerApp({ vscode });

startServer();
