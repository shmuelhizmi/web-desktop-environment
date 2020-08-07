import * as React from "react";
import { Themes } from "@root/theme";
import { ThemeProvider as TP } from "@material-ui/styles";
import {
	ThemeType,
	Theme,
} from "@web-desktop-environment/interfaces/lib/shared/settings";

class ThemeProvider extends React.Component<{
	theme?: ThemeType;
	customTheme?: Theme;
}> {
	render() {
		const { theme, customTheme } = this.props;
		return (
			<TP
				theme={
					theme !== "custom"
						? Themes[theme || "transparent"]
						: customTheme || Themes.transparent
				}
			>
				{this.props.children}
			</TP>
		);
	}
}

export default ThemeProvider;
