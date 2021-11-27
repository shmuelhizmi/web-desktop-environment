import API from '../../../backend/index'

export class DownloadManager {
	addFile(path: string) {
		return API.downloadManager.addFile.execute(path);
	}
	getDownloadManagerPort() {
		return API.downloadManager.getDownloadManagerPort.execute();
	}
}

export default new DownloadManager();