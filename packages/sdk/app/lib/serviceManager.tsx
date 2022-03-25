import API from "@web-desktop-environment/server-api";
import { LoggingManager } from "@web-desktop-environment/server-api/lib/frontend/managers/logging/loggingManager";


export class ServiceManager {
    private static logger = API.loggingManager.mount("service_manager");

    public static async requestRenderPort(name: string): Promise<{ port: number; serviceLogger: LoggingManager }> {
        return {
            serviceLogger: this.logger.mount(name),
            port: await API.serviceManager.requestUIPort(),
        }
    }
}
