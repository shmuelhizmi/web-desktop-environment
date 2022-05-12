import ManagerBase from "../../managerBase";

interface PortManagerEvents {}

export class PortManager extends ManagerBase<PortManagerEvents> {
  name = "portManager";
  getPort = this.registerFunction<() => { port: number }>(
    "getPort"
  );
  withDomain = this.registerFunction<() => { port: number; domain: string; }>(
    "withDomain"
  );
}

export default new PortManager();
