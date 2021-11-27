import API from '../../../backend/index'

export class PortManager {
	getPort() {
		return API.portManager.getPort.execute();
	}

}

export default new PortManager();