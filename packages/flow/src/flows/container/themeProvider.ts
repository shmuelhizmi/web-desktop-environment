import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { settingManager } from "../..";

export default <
  Flow<ViewInterfacesType, { childFlow: Flow<any>; childInput?: any }>
>(async ({
  view,
  views,
  input: { childFlow, childInput },
  flow,
  onCanceled,
}) => {
  const theme = view(0, views.themeProvider, {
    theme: settingManager.settings.desktop.theme,
  });
  settingManager.emitter.on("onNewSettings", (settings) =>
    theme.update({ theme: settings.desktop.theme })
  );
  const app = flow(childFlow, childInput, theme);
  onCanceled(() => {
    app.cancel();
  });
  await theme;
});
