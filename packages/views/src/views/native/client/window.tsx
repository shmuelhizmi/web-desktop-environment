import WindowInterface, {
	LastWindowState,
} from "@web-desktop-environment/interfaces/lib/views/Window";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import React, { useState, useEffect } from "react";
import {
	withStyles,
	WithStyles,
	createStyles,
	WithTheme,
	withTheme,
	makeStyles,
} from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";

const styles = (theme: Theme) =>
	createStyles({
		container: {
			position: "absolute",
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
			justifyContent: "center",
			background: theme.background.main,
			display: "flex",
			width: "100%",
			height: "100%",
			zIndex: 2,
		},
	});

const useStyle = makeStyles({
	image: {
		position: "absolute",
		transition: "transform 400ms",
		zIndex: 1,
	},
});

export const LocationBasedImage = ({ background }: { background: string }) => {
	const classes = useStyle();
	const [top, setTop] = useState(0);
	const [left, setLeft] = useState(0);
	useEffect(() => {
		const loop = setInterval(() => {
			if (window.screen.availWidth - window.innerWidth === 0) {
				setTop(0);
				setLeft(0);
			} else {
				setTop(window.screenY);
				setLeft(window.screenX);
			}
		}, 500);
		return () => clearInterval(loop);
	}, []);
	return (
		<div
			className={classes.image}
			style={{
				background,
				width: window.screen.width,
				height: window.screen.height,
				transform: `translate(
				  -${left && left % window.screen.availWidth}px,
				  -${top && top - 40}px
				   )`,
			}}
		/>
	);
};

class Window extends ReflowReactComponent<
	WindowInterface,
	WithStyles<typeof styles> & WithTheme<Theme>
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
		document.title = this.props.title;
		return (
			<div>
				<div className={classes.container}>{this.props.children}</div>
				{this.props.theme.type === "transparent" && (
					<LocationBasedImage background={background} />
				)}
			</div>
		);
	}
}

export default withTheme(withStyles(styles, { withTheme: true })(Window));
