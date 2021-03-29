import React from "react";
import { DesktopContext } from "@views/Desktop";
import { reactFullstackConnectionManager } from "@root/App";
import { appViews } from "@views/index";
import { Client } from "@react-fullstack/fullstack-socket-client";

class AppView extends React.Component {
	render() {
		return (
			<DesktopContext.Consumer>
				{(desktop) => {
					const { currentApp } = desktop;
					return (
						currentApp && (
							<Client
								{...reactFullstackConnectionManager.connect(currentApp.port)}
								views={appViews}
							/>
						)
					);
				}}
			</DesktopContext.Consumer>
		);
	}
}
export default AppView;
