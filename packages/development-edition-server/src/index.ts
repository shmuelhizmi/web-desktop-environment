import { startServer } from "@web-desktop-environment/server-sdk";
import { AppsManager } from "@web-desktop-environment/server-sdk/lib/components/apps";
import { vscode } from "./components/apps/VisualStudioCode";

AppsManager.registerApp({ vscode });

startServer();
