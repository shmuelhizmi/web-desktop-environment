import { Themes } from "@root/theme";
import React from "react";
import {
	ThemeType,
	Theme,
} from "@web-desktop-environment/interfaces/lib/shared/settings";

export const ThemeContext = React.createContext<Theme>(Themes.transparent);

class ThemeProvider extends React.Component<{
	theme?: ThemeType;
	customTheme?: Theme;
}> {
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
