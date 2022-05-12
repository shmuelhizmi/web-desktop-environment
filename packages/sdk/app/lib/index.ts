export { AppsManager, App } from "./appManager";
export { ServiceManager } from "./serviceManager";
import API from "@web-desktop-environment/server-api/lib";
import AppBase from "./components/appBase";
import Window from "./components/window";

export { AppBase, Window };

export const keepOpen = () => setTimeout(keepOpen, 2147483647);

// hooks
export {
	AppFunctionComponent,
	AppFunctionComponentProps,
	asApp,
} from "./components/asApp";
export { useViews } from "./hooks/useViews";
export { useProcess } from "./hooks/node";
export * as x11Utils from "./utils/x11";
