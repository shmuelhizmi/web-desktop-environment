import React from "react";
import { Component } from "@react-fullstack/fullstack";
import IframeInterface from "@web-desktop-environment/interfaces/lib/views/apps/thirdParty/Iframe";
import {
	withStyles,
	createStyles,
	WithStyles,
	withTheme,
	WithTheme,
} from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { reactFullstackConnectionManager } from "@root/index";

const styles = (theme: Theme) =>
	createStyles({
		root: {
			width: "100%",
			height: "100%",
			border: theme.windowBorder
				? `1px solid ${theme.windowBorderColor}`
				: "none",
			borderTop: "none",
			borderRadius: "0 0 9px 9px",
			background: theme.background.main,
			backdropFilter: "blur(15px)",
			boxShadow: `-10px 12px 20px -2px  ${theme.shadowColor}`,
		},
	});

class Iframe extends Component<
	IframeInterface,
	{},
	WithStyles<typeof styles> & WithTheme<Theme>
> {
	render() {
		const { classes, host, port, path } = this.props;

		return (
			<iframe
				className={classes.root}
				src={`http://${host || reactFullstackConnectionManager.host}${
					port ? ":" + port : ""
				}${path || ""}`}
			/>
		);
	}
}

export default withTheme(withStyles(styles, { withTheme: true })(Iframe));
