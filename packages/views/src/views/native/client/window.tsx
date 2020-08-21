import WindowInterface, {
	LastWindowState,
} from "@web-desktop-environment/interfaces/lib/views/Window";
import { ReflowReactComponent } from "@web-desktop-environment/reflow-react-display-layer";
import React from "react";
import { withStyles, WithStyles, createStyles } from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";

const styles = (theme: Theme) =>
	createStyles({
		root: {
			position: "absolute",
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
			justifyContent: "center",
			display: "flex",
			background: theme.background.transparent || theme.background.dark,
		},
		container: {
			width: "100%",
			height: "100%",
		},
	});

class Window extends ReflowReactComponent<
	WindowInterface,
	WithStyles<typeof styles>
> {
	get windowState(): LastWindowState {
		return {
			size: { height: window.innerHeight, width: window.innerWidth },
			minimized: window.document.hidden,
			position: {
				x: window.screenX,
				y: window.screenY,
			},
		};
	}
	componentDidMount = () => {
		document.title = this.props.title;
		window.addEventListener("resize", () => {
			this.props.event("setWindowState", this.windowState);
		});
		window.addEventListener("visibilitychange", () => {
			this.props.event("setWindowState", this.windowState);
		});
		let positionX = window.screenX;
		let positionY = window.screenY;
		setInterval(() => {
			if (positionX !== window.screenX || positionY !== window.screenY) {
				positionX = window.screenX;
				positionY = window.screenY;
				this.props.event("setWindowState", this.windowState);
			}
		}, 1000);
	};

	render() {
		const { classes, background } = this.props;
		return (
			<div className={classes.root} style={{ background }}>
				<div className={classes.container}>{this.props.children}</div>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Window);
