import API from "@web-desktop-environment/server-api";
import { LoggingManager } from "@web-desktop-environment/server-api/lib/frontend/managers/logging/loggingManager";
import React from "react";
import { Render } from "@react-fullstack/render";
import { createSocketServer } from "@react-fullstack/fullstack-socket-server";
import { Server as ServerBase } from "@react-fullstack/fullstack/server";

const Server = createSocketServer(ServerBase);
export class ServiceManager {
	private static logger = API.loggingManager.mount("service_manager");

	public static async requestRenderPort(
		name: string
	): Promise<{ port: number; serviceLogger: LoggingManager }> {
		return {
			serviceLogger: this.logger.mount(name),
			port: await API.serviceManager.requestUIPort(),
		};
	}

	public static async renderService(
		ServiceApp: React.FunctionComponent<{ serviceLogger: LoggingManager }>,
		name: string
	) {
		const { port, serviceLogger } = await this.requestRenderPort(name);
		Render(
			<Server singleInstance port={port}>
				{() => (
					<>
						<ServiceApp serviceLogger={serviceLogger} />
					</>
				)}
			</Server>
		);
	}
}
