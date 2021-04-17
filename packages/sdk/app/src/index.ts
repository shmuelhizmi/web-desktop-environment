export { AppsManager, App } from "./appManger";
import AppBase from "./components/appBase";
import Window from "./components/window";

export { AppBase, Window };

export const keepOpen = () => setTimeout(keepOpen, 2147483647);
