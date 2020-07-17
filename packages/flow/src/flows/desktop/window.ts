import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { App } from "../apps";
import Logger from "../shared/utils/logger";

interface WindowInput {
  app: App;
  appParams: any;
  parentLogger: Logger;
}

export default <Flow<ViewInterfacesType, WindowInput>>(async ({
  view,
  views,
  flow,
  input: { app, appParams, parentLogger },
}) => {
  const logger = parentLogger.mount("window");
  // Using the view() function to display the MyView component, at layer 0 of this flow
  const appWindow = { ...app.window };
  const window = view(0, views.window, {
    icon: app.icon,
    title: app.name,
    name: app.name,
    window: appWindow,
  });

  window.on("setWindowState", ({ minimized, position }) => {
    appWindow.position = position;
    appWindow.minimized = minimized;
    window.update({ window: appWindow });
  });

  const runningApp = flow(
    app.flow,
    { ...app.defaultInput, ...appParams, parentLogger: logger },
    window
  );

  runningApp.on("change_title", (title) => {
    logger.info(`update window title to ${title}`);
    window.update({ title });
  });

  window.then(() => {
    logger.warn(`window ${app.name} - flow is canceled`);
    runningApp.cancel();
  });
  await runningApp;
  window.done({});
  await window;
});
