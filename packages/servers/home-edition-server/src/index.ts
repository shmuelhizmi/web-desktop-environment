import {
	startServer,
	registerDefaultApps,
} from "@web-desktop-environment/server-sdk";

startServer().then(registerDefaultApps);
