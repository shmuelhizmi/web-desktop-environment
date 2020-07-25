import { Themes, Theme } from "@root/theme";
import React from "react";
import { ThemeType } from "@web-desktop-environment/interfaces/lib/shared/settings";

export const ThemeContext = React.createContext<Theme>(Themes.transparent);

class ThemeProvider extends React.Component<{ theme?: ThemeType }> {
	render() {
		return (
			<ThemeContext.Provider value={Themes[this.props.theme || "transparent"]}>
				{this.props.children}
			</ThemeContext.Provider>
		);
	}
}

export default ThemeProvider;
