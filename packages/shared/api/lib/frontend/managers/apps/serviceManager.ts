import uuid from "uuid";
import APIBackend from "../../../backend/index";

export class ServiceManager {
    requestUIPort = () => APIBackend.serviceManager.requestUIPort.execute();
}

export default new ServiceManager();
