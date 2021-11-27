import ManagerBase from "../../managerBase";

interface DownloadManagerEvents {}

export class DownloadManager extends ManagerBase<DownloadManagerEvents> {
  name = "downloadManager";
  addFile = this.registerFunction<(path: string) => { hash: string }>(
    "addFile"
  );
  getDownloadManagerPort = this.registerFunction<() => number>(
    "getDownloadManagerPort"
  );
}

export default new DownloadManager();
