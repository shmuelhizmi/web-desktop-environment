import { Icon } from "@web-desktop-environment/interfaces/lib/shared/icon";
import ManagerBase from "../../managerBase";

interface ServiceManagerEvents {
  requestUIPort: number;
}

export class ServiceManager extends ManagerBase<ServiceManagerEvents> {
  name = "ServiceManager";
 requestUIPort = this.registerFunction<() => number>("requestUIPort");
}

export default new ServiceManager();
