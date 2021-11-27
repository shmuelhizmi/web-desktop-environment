import uuid from "uuid";
import APIBackend from "../../../backend/index";
import { AppRegistrationData } from "../../../backend/managers/apps/appsManager";

export class AppsManager {
  registerApp(
    app: Omit<AppRegistrationData, "id">,
    onLaunch: (port: number, options: any, closePromise: Promise<void>, close: () => Promise<void>) => void
  ) {
    const id = uuid();
    APIBackend.appsManager.on(
      "launchApp",
      ({ appId, options, port, processId }) => {
        const waitForClose = new Promise<void>((res) => {
          APIBackend.appsManager.on(
            "closeApp",
            ({ processId: closeProcessId }) => {
              if (processId === closeProcessId) {
                res();
              }
            }
          );
        });
        if (id === appId) {
          onLaunch(port, options, waitForClose, () => this.closeApp(processId));
        }
      }
    );
    return APIBackend.appsManager.registerApp.execute({
      ...app,
      id,
    });
  }
  launchApp(name: string, options: any) {
    return APIBackend.appsManager.launchApp.execute(name, options);
  }
  closeApp(processId: string) {
    return APIBackend.appsManager.closeApp.execute(processId);
  }
}

export default new AppsManager();
