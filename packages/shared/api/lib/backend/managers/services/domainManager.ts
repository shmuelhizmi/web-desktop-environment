import ManagerBase from "../../managerBase";

interface DomainManagerEvents {}

export class DomainManager extends ManagerBase<DomainManagerEvents> {
  name = "domainManager";
  registerDomain = this.registerFunction<(name: string, target: string) => void>(
    "registerDomain"
  );
}

export default new DomainManager();
