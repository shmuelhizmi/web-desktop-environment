import ManagerBase from "../../managerBase";

interface PortManagerEvents {}

export class PortManager extends ManagerBase<PortManagerEvents> {
  name = "portManager";
  getPort = this.registerFunction<() => { port: number }>(
    "getPort"
  );
  withDomian = this.registerFunction<() => { port: number; domain: string }>(
    "withDomian"
  );
}

export default new PortManager();
