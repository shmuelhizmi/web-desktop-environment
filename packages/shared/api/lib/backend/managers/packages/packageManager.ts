import ManagerBase from "../../managerBase";

interface PackageManagerEvents {}

export class PackageManager extends ManagerBase<PackageManagerEvents> {
  name = "packageManager";
  scanForNewPackages = this.registerFunction<() => {}>("scanForNewPackages");
}

export default new PackageManager();
