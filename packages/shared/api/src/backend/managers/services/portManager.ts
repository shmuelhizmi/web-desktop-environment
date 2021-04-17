import ManagerBase from "../../managerBase";

interface PortManagerEvents {}

export class PortManager extends ManagerBase<PortManagerEvents> {
  name = "portManager";
  getPort = this.registerFunction<() => { port: number }>(
    "getPort"
  );
}

export default new PortManager();
