import API from "../../../backend/index";

export class PortManager {
  getPort() {
    return API.portManager.getPort.execute();
  }
  withDomain() {
    return API.portManager.withDomain.execute();
  }
}

export default new PortManager();
