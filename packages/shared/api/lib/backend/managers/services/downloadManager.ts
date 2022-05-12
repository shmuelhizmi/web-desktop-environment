import ManagerBase from "../../managerBase";

interface DownloadManagerEvents {}

export class DownloadManager extends ManagerBase<DownloadManagerEvents> {
  name = "downloadManager";
  addFile = this.registerFunction<(path: string) => { hash: string }>(
    "addFile"
  );
  domain = this.registerFunction<() => string>(
    "domain"
  );
}

export default new DownloadManager();
