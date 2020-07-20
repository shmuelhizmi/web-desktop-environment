import WindowInterface from "@web-desktop-environment/interfaces/lib/views/Window";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@root/theme";
import ReactDOM from "react-dom";
import Dragable from "react-draggable";
import windowManager from "@state/WindowManager";
import { windowsBarHeight } from "@views/desktop";
import Icon from "@components/icon";

const styles = (theme: Theme) =>
	createStyles({
		root: {
			position: "absolute",
		},
		bar: {
			background: theme.windowBarColor,
			backdropFilter: theme.type === "transparent" ? "blur(15px)" : "none",
			border: `1px solid ${theme.windowBorderColor}`,
			borderBottom: "none",
			borderRadius: "7px 7px 0 0",
			cursor: "move",
			display: "flex",
			flexDirection: "row-reverse",
		},
		barCollaps: {
			borderRadius: "7px 7px 7px 7px",
			borderBottom: `1px solid ${theme.windowBorderColor}`,
		},
		body: {
			borderRadius: "0 0 3px 3px",
		},
		barButtonsContainer: {
			position: "relative",
			top: 4,
			right: 5,
			width: 40,
			height: 20,
			display: "flex",
			justifyContent: "space-between",
		},
		barButton: {
			width: 15,
			height: 15,
			borderRadius: "50%",
			zIndex: 2,
			border: "1px solid #0004",
		},
		barButtonExit: {
			cursor: "pointer",
			background: theme.error.main,
			"&:hover": {
				background: theme.error.dark,
			},
		},
		barButtonCollaps: {
			cursor: "pointer",
			background: theme.success.main,
			"&:hover": {
				background: theme.success.dark,
			},
		},
		barButtonInactive: {
			background: theme.primary.transparent,
		},
		barTitle: {
			position: "relative",
			right: -35,
			top: 2,
			width: "100%",
			textAlign: "center",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
			userSelect: "none",
			color: theme.background.text,
		},
		barTitleIcon: {
			position: "relative",
			top: 3,
		},
	});

interface WindowState {
	size: { height: number; width: number };
	canDrag: boolean;
	collaps: boolean;
	position: { x: number; y: number };
	isActive?: boolean;
}

const defualtWindowSize = { height: 600, width: 700 };

export const windowBarHeight = 25;

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class Window extends ReflowReactComponent<
	WindowInterface,
	WithStyles<typeof styles>,
	WindowState
> {
	domContainer: Element;
	id: number;
	wrapperRef?: HTMLDivElement;
	constructor(props: Window["props"]) {
		super(props);
		this.state = {
			size: {
				height: props.window.height || defualtWindowSize.height,
				width: props.window.width || defualtWindowSize.width,
			},
			canDrag: false,
			collaps: props.window.minimized || false,
			position: props.window.position || {
				x: window.screen.availWidth / 3,
				y: window.screen.availHeight / 3,
			},
		};
		this.domContainer = document.createElement("div");
		document.getElementById("app")?.appendChild(this.domContainer);

		this.id = windowManager.addWindow(props.name, props.icon, {
			minimized: props.window.minimized || false,
		});

		windowManager.emitter.on("minimizeWindow", ({ id }) => {
			this.props.event("setWindowState", {
				minimized: true,
				position: this.state.position,
			});
			if (id === this.id) {
				this.moveToTop();
				this.setState({ collaps: true, isActive: true });
			} else this.setState({ isActive: false });
		});

		windowManager.emitter.on("maximizeWindow", ({ id }) => {
			this.props.event("setWindowState", {
				minimized: false,
				position: this.state.position,
			});
			if (id === this.id) {
				this.moveToTop();
				this.setState({ collaps: false, isActive: true });
			} else this.setState({ isActive: false });
		});
	}

	componentDidMount() {
		document.addEventListener("mousedown", (e) => {
			if (this.wrapperRef && e.target) {
				if (
					this.wrapperRef &&
					!this.wrapperRef.contains(e.target as HTMLElement)
				) {
					this.handleClickOutside();
				}
			}
		});
	}

	handleClickOutside = () => {
		this.setState({ isActive: false });
	};

	moveToTop = () => {
		this.setState({ isActive: true });
		// remove and readd window -> move to top in html tree
		const parent = document.getElementById("app");
		if (parent) {
			if (
				parent.childNodes[parent.childNodes.length - 1] !== this.domContainer
			) {
				parent.removeChild(this.domContainer);
				parent.appendChild(this.domContainer);
			}
		}
	};

	render() {
		const { size, canDrag, collaps, isActive } = this.state;
		const {
			children,
			classes,
			done,
			title,
			icon,
			event,
			window: { maxHeight, maxWidth, minHeight, minWidth },
		} = this.props;
		return ReactDOM.createPortal(
			<div
				ref={(element) => {
					if (element) this.wrapperRef = element;
				}}
			>
				<Dragable
					disabled={!canDrag}
					defaultPosition={this.state.position}
					onDrag={(e, position) => {
						this.moveToTop();
						if (
							position.y < 0 ||
							position.y >
								window.innerHeight - windowBarHeight - windowsBarHeight ||
							position.x < 0 - size.width * 0.5 ||
							position.x > window.innerWidth - size.width * 0.5
						) {
							return false;
						}
					}}
					onStop={(e, fullPosition) => {
						const position = { x: fullPosition.x, y: fullPosition.y };
						if (position.y < 0) {
							position.y = 0;
						}
						if (
							position.y >
							window.innerHeight - windowBarHeight - windowsBarHeight
						) {
							position.y =
								window.innerHeight - windowBarHeight - windowsBarHeight;
						}
						if (position.x < 0) {
							position.x = 0;
						}
						if (position.x > window.innerWidth - size.width) {
							position.x = window.innerWidth - size.width;
						}
						this.setState({ position });
						event("setWindowState", {
							position,
							minimized: this.state.collaps,
						});
					}}
				>
					<div
						className={classes.root}
						onClick={() => this.moveToTop()}
						style={{
							width: size.width,
						}}
					>
						<div
							style={{ height: windowBarHeight, width: size.width }}
							onMouseEnter={() => this.setState({ canDrag: true })}
							onMouseLeave={() => this.setState({ canDrag: false })}
							className={`${classes.bar} ${
								this.state.collaps ? classes.barCollaps : ""
							}`}
						>
							<div className={classes.barButtonsContainer}>
								<div
									onClick={() => {
										windowManager.updateState(this.id, {
											minimized: !this.state.collaps,
										});
									}}
									className={`${classes.barButton} ${
										isActive
											? classes.barButtonCollaps
											: classes.barButtonInactive
									}`}
								/>
								<div
									className={`${classes.barButton} ${
										isActive ? classes.barButtonExit : classes.barButtonInactive
									}`}
									onClick={() => {
										done({});
										windowManager.closeWindow(this.id);
									}}
								/>
							</div>
							<div className={classes.barTitle}>
								{title} -{" "}
								{icon.type === "icon" ? (
									<Icon
										parentClassName={classes.barTitleIcon}
										name={icon.icon}
									/>
								) : (
									<img
										className={classes.barTitleIcon}
										alt="windows icon"
										width={14}
										height={14}
									/>
								)}
							</div>
						</div>
						{!collaps && (
							<div
								className={classes.body}
								style={{
									maxHeight,
									maxWidth,
									minHeight,
									minWidth,
									...size,
								}}
							>
								{children}
							</div>
						)}
					</div>
				</Dragable>
			</div>,
			this.domContainer
		);
	}
}

export default withStyles(styles, { withTheme: true })(Window);
