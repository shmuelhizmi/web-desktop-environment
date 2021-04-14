import API from "../../../backend/index";

export class PackageManager {
  searchForNewPackages() {
    return API.packageManager.scanForNewPackages.execute();
  }
}

export default new PackageManager();
