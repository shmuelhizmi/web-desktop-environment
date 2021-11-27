import { Icon } from "@web-desktop-environment/interfaces/lib/shared/icon";
import ManagerBase from "../../managerBase";

interface AppsManagerEvents {
  launchApp: {
    appId: string;
    port: number;
    options: any;
	processId: string;
  };
  closeApp: {
	  processId: string;
  };
}

export interface AppRegistrationData {
  name: string;
  displayName: string;
  icon: Icon;
  description: string;
  id: string;
}

export class AppsManager extends ManagerBase<AppsManagerEvents> {
  name = "appsManager";
  registerApp = this.registerFunction<(app: AppRegistrationData) => void>(
    "registerApp"
  );
  launchApp = this.registerFunction<
    (id: string, options: any) => { processId: string }
  >("launchApp");
  closeApp = this.registerFunction<(processId: string) => void>("closeApp");
}

export default new AppsManager();
