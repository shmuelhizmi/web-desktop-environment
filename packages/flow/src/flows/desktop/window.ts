import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { App } from "../apps";

interface WindowInput {
  app: App;
  appParams: any;
}

export default <Flow<ViewInterfacesType, WindowInput>>(async ({
  view,
  views,
  flow,
  input: { app, appParams },
}) => {
  // Using the view() function to display the MyView component, at layer 0 of this flow
  const appWindow = {...app.window};
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
    { ...app.defaultInput, ...appParams },
    window
  );

  runningApp.on("change_title", (title) => window.update({ title }));

  window.then(() => {
    runningApp.cancel();
  });
  await runningApp;
  window.done({});
  await window;
});
