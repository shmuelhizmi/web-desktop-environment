import React from "react";
import { DesktopContext } from "@views/desktop";
import { ReflowDisplayLayerElement } from "@web-desktop-environment/reflow-react-display-layer";
import { reflowConnectionManager } from "@root/App";
import * as views from "@views/index";
import ThemeProvider from "@components/themeProvider";

class AppView extends React.Component {
	render() {
		return (
			<DesktopContext.Consumer>
				{(desktop) => {
					const { currentApp } = desktop;
					return (
						currentApp && (
							<ReflowDisplayLayerElement
								{...reflowConnectionManager.connect(currentApp.port)}
								views={views}
								wrapper={ThemeProvider}
							/>
						)
					);
				}}
			</DesktopContext.Consumer>
		);
	}
}
export default AppView;
