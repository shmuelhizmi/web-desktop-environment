import * as React from "react";
import { Themes } from "@root/theme";
import { ThemeProvider as TP } from "@material-ui/styles";
import { ThemeType } from "@web-desktop-environment/interfaces/lib/shared/settings";

class ThemeProvider extends React.Component<{ theme?: ThemeType }> {
	render() {
		return (
			<TP theme={Themes[this.props.theme || "transparent"]}>
				{this.props.children}
			</TP>
		);
	}
}

export default ThemeProvider;
