import API from '../../../backend/index'

export class DownloadManager {
	addFile(path: string) {
		return API.downloadManager.addFile.execute(path);
	}
	getDownloadManagerDomain() {
		return API.downloadManager.domain.execute();
	}
}

export default new DownloadManager();