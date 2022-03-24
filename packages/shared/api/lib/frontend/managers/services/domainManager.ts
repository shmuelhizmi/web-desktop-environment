import API from "../../../backend/index";

export class DomainManager {
  registerDomain(name: string | number, target: string | number) {
    target = typeof target === "number" ? `localhost:${target}` : target;
    return API.domainManager.registerDomain.execute(String(name), target);
  }
}

export default new DomainManager();
