import React from "react";
import { DesktopContext } from "@views/Desktop";
import { reactFullstackConnectionManager } from "@root/App";
import * as views from "@views/index";
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
								views={views}
							/>
						)
					);
				}}
			</DesktopContext.Consumer>
		);
	}
}
export default AppView;
