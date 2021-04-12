import {
	startServer,
	registerDefaultApps,
} from "@web-desktop-environment/server-sdk";
import { registerApp as registerVSCode } from "./components/apps/VisualStudioCode";

startServer().then(registerDefaultApps).then(registerVSCode);
