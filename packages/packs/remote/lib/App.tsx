import React, { useState } from "react";
import { LoggingManager } from "@web-desktop-environment/server-api/lib/frontend/managers/logging/loggingManager";
import { ServiceActionItem } from "@web-desktop-environment/interfaces/lib/views/desktop/service";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces/lib";
import { useXpra } from "./useXpra";

export function RemoteServiceApp(props: RemoteServiceAppProps) {
	const { serviceLogger: logger } = props;
	const [started, setStarted] = useState(false);
	const { status } = useXpra(started);

	function onAction(action: "start" | "end") {
		if (action === "start") {
			setStarted(true);
		} else {
			setStarted(false);
		}
	}

	const currentStatus: ServiceActionItem = {
		id: "status",
		icon: {
			type: "icon",
			icon: "VscInfo",
		},
		text: `Status: ${status}`,
		clickable: false,
	};

	const startButtons: ServiceActionItem[] = [
		{
			text: "Start",
			id: "start",
			icon: { type: "icon", icon: "VscPlay" },
		},
		currentStatus,
	];
	const endButtons: ServiceActionItem[] = [
		{
			text: "End",
			id: "end",
			icon: { type: "icon", icon: "VscDebugPause" },
		},
		currentStatus,
	];

	return (
		<>
			<ViewsProvider<ViewInterfacesType>>
				{({ Service }) => (
					<Service
						text="x11 renderer"
						icon={{ type: "icon", icon: "VscWindow" }}
						buttons={started ? endButtons : startButtons}
						onAction={onAction}
					/>
				)}
			</ViewsProvider>
		</>
	);
}

interface RemoteServiceAppProps {
	serviceLogger: LoggingManager;
}
