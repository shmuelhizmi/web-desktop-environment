import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces";
import { settingManager } from "../..";
import Emiiter from "../shared/utils/emitter";

export type CancelEmitterEvent = {
  cancel: void;
};

type CancelEmitter = Emiiter<CancelEmitterEvent>;

export default <
  Flow<
    ViewInterfacesType,
    { childFlow: Flow<any>; childInput?: any; cancelEmitter: CancelEmitter }
  >
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
