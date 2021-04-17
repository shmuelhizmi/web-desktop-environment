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
	private iframeRef = React.createRef<HTMLIFrameElement>();

	private intervalsToClear: NodeJS.Timeout[] = [];

	componentDidMount = () => {
		this.intervalsToClear.push(
			setInterval(() => {
				const activeElement = document.activeElement;
				if (
					this.iframeRef.current &&
					activeElement &&
					activeElement !== document.body &&
					this.iframeRef.current === activeElement
				) {
					this.iframeRef.current.click();
				}
			}, 50)
		);
	};

	componentWillUnmount = () => {
		this.intervalsToClear.forEach(clearInterval);
	};

	render() {
		const {
			classes,
			host,
			port,
			path,
			https = reactFullstackConnectionManager.https,
		} = this.props;

		return (
			<iframe
				ref={this.iframeRef}
				allowFullScreen
				allowTransparency
				sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-scripts allow-same-origin"
				allow="clipboard-read; clipboard-write; geolocation; allow-forms; allow-pointer-lock; fullscreen; camera; microphone; layout-animations; unoptimized-images; oversized-images; sync-script; sync-xhr; unsized-media;"
				className={classes.root}
				src={`${https ? "https" : "http"}://${
					host || reactFullstackConnectionManager.host
				}${port ? ":" + port : ""}${path || ""}`}
			/>
		);
	}
}

export default withTheme(
	withStyles(styles, { withTheme: true, name: "Iframe" })(Iframe)
);
