import React, { useState, useEffect } from "react";
import { LoggingManager } from "@web-desktop-environment/server-api/lib/frontend/managers/logging/loggingManager";
import { ServiceActionItem } from "@web-desktop-environment/interfaces/lib/views/desktop/service";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { Views } from "../shared/types";
import { useXpra } from "./useXpra";

export function RemoteServiceApp(props: RemoteServiceAppProps) {
	const { serviceLogger: logger } = props;
	const [started, setStarted] = useState(true);
	const { status, domain, error, xpra, pingedSuccessfully } = useXpra(started);

	useEffect(() => {
		logger.info(`Xpra status: ${status} - ${error}`);
	}, [status, error]);

	useEffect(() => {
		if (!xpra) {
			return;
		}
		xpra.on("data", (data: any) => logger.info(String(data)));
	}, [xpra]);

	function onAction() {
		setStarted(!started);
	}

	const currentStatus: ServiceActionItem = {
		id: "status",
		icon: {
			type: "icon",
			icon: "VscInfo",
		},
		text: `Status: ${
			status === "running"
				? pingedSuccessfully
					? "running"
					: "starting"
				: "stoped"
		}`,
		clickable: false,
	};

	const endButtons: ServiceActionItem[] = [
		{
			text: "Kill",
			id: "end",
			icon: { type: "icon", icon: "VscDebugStop" },
		},
		currentStatus,
	];

	const startButtons: ServiceActionItem[] = [
		{
			text: "Start",
			id: "start",
			icon: { type: "icon", icon: "VscDebugStart" },
		},
		currentStatus,
	];

	return (
		<>
			<ViewsProvider<Views>>
				{({ XpraWrapper, Service }) =>
					domain && (
						<>
							<Service
								onAction={onAction}
								buttons={started ? endButtons : startButtons}
								icon={{
									type: "icon",
									icon: "VscRemote",
								}}
								text="Xpra"
							>
								{pingedSuccessfully && (
									<XpraWrapper
										domain={domain}
										onConnect={() => logger.info("Connected to Xpra")}
										onDisconnect={() => logger.info("Disconnected from Xpra")}
										onError={(error) => logger.error(error)}
										onSessionStarted={() => logger.info("Session started")}
									/>
								)}
							</Service>
						</>
					)
				}
			</ViewsProvider>
		</>
	);
}

interface RemoteServiceAppProps {
	serviceLogger: LoggingManager;
}
