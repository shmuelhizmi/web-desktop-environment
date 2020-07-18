import Emitter from "@utils/emitter";
import { apps } from "@apps/index";
import { createReflow, portManager } from "@index";
import themeProvider, { CancelEmitterEvent } from "@container/themeProvider";
import Logger from "@utils/logger";
import { OpenApp } from "@web-desktop-environment/interfaces/lib/views/Desktop";
import window from "@desktop/window";
interface WindowManagerEvents {
  onAppLaunch: OpenApp;
  onAppsUpdate: OpenApp[];
}

export default class WindowManager {
  private logger: Logger;

  private _runningApps: (OpenApp & { cancel: () => void })[] = [];
  public get runningApps() {
    return this._runningApps;
  }
  private newAppId = 0;

  public emitter = new Emitter<WindowManagerEvents>();

  constructor(parentLogger: Logger) {
    this.logger = parentLogger.mount("windows-manager");
  }

  spawnApp = async (flow: string, input: any) => {
    const handler = apps[flow];
    const port = await portManager.getPort();
    const id = this.newAppId;
    this.newAppId++;
    const cancelEmiiter = new Emitter<CancelEmitterEvent>();
    createReflow(port)
      .start(themeProvider, {
        childFlow: window,
        cancelEmiiter: cancelEmiiter,
        childInput: {
          parentLogger: this.logger,
          app: handler,
          appParams: {},
        },
      })
      .then(() => {
        this._runningApps = this._runningApps.filter((app) => app.id !== id);
        this.emitter.call("onAppsUpdate", this._runningApps);
      });
    const openApp = {
      icon: handler.icon,
      id,
      name: handler.name,
      port,
      cancel: () => cancelEmiiter.call("cancel", null),
    };
    this.emitter.call("onAppLaunch", openApp);
    this._runningApps.push(openApp);
    this.emitter.call("onAppsUpdate", this._runningApps);
  };

  killApp = (id: number) => {
    this._runningApps.find((app) => app.id === id).cancel();
    this._runningApps.filter((app) => app.id !== id);
    this.emitter.call("onAppsUpdate", this._runningApps);
  };
}
