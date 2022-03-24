import API from "../../../backend/index";

export class PortManager {
  getPort() {
    return API.portManager.getPort.execute();
  }
  withDomian() {
    return API.portManager.withDomian.execute();
  }
}

export default new PortManager();
