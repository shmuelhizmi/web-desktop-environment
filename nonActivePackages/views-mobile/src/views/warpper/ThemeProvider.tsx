import { Themes } from "@root/theme";
import React from "react";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { Component } from "@react-fullstack/fullstack";
import ThemeProviderViewInterface from "@web-desktop-environment/interfaces/lib/views/ThemeProvider";

export const ThemeContext = React.createContext<Theme>(Themes.transparent);

class ThemeProvider extends Component<ThemeProviderViewInterface> {
	render() {
		const { theme, customTheme } = this.props;
		return (
			<ThemeContext.Provider
				value={
					theme !== "custom"
						? Themes[theme || "transparent"]
						: customTheme || Themes.transparent
				}
			>
				{this.props.children}
			</ThemeContext.Provider>
		);
	}
}

export default ThemeProvider;
