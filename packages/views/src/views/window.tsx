import WindowInterface from "@web-desktop-environment/interfaces/lib/views/Window";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@root/theme";
import ReactDOM from "react-dom";
import Dragable from "react-draggable";
import windowManager from "@state/WindowManager";
import { windowsBarHeight } from "@views/desktop";
import Icon from "@components/icon";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

export const defualtWindowSize = {
	height: 600,
	width: 700,
	maxHeight: 700,
	maxWidth: 1000,
	minHeight: 300,
	minWidth: 400,
};

export const windowBarHeight = 25;

const styles = (theme: Theme) =>
	createStyles({
		root: {
			position: "absolute",
			padding: 5,
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
			height: windowBarHeight,
			width: "100%",
			justifyContent: "space-between",
		},
		barCollaps: {
			borderRadius: "7px 7px 7px 7px",
			borderBottom: `1px solid ${theme.windowBorderColor}`,
		},
		body: {
			borderRadius: "0 0 3px 3px",
			width: "100%",
			height: `calc(100% - ${windowBarHeight}px)`,
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
			top: 2,
			left: 45,
			width: "100%",
			textAlign: "center",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
			maxWidth: "calc(100% - 90px)",
			userSelect: "none",
			color: theme.background.text,
		},
		barTitleIcon: {
			position: "relative",
			top: 3,
		},
	});

type Size = {
	height: number;
	width: number;
};

interface WindowState {
	size: Size;
	canDrag: boolean;
	collaps: boolean;
	position: { x: number; y: number };
	isActive?: boolean;
}

class Window extends ReflowReactComponent<
	WindowInterface,
	WithStyles<typeof styles>,
	WindowState
> {
	domContainer: Element;
	id!: number;
	wrapperRef?: HTMLDivElement;
	constructor(props: Window["props"]) {
		super(props);
		const size = {
			height: props.window.height || defualtWindowSize.height,
			width: props.window.width || defualtWindowSize.width,
		};
		this.state = {
			size,
			canDrag: false,
			collaps: props.window.minimized || false,
			position: this.getPoition(size),
		};

		this.domContainer = document.createElement("div");
		document.getElementById("app")?.appendChild(this.domContainer);
	}

	getPoition = (size: Size) => {
		if (this.props.window.position) {
			const position = { ...this.props.window.position };
			if (position.x > window.innerWidth - size.width / 2) {
				position.x = window.innerWidth - size.width;
			}
			if (position.x < windowBarHeight) {
				position.x = windowBarHeight;
			}
			if (position.y > window.innerHeight) {
				position.y = window.innerHeight;
			}
			if (position.y < windowBarHeight) {
				position.y = windowBarHeight;
			}
			return position;
		} else {
			return {
				x: window.screen.availWidth / 3,
				y: window.screen.availHeight / 3,
			};
		}
	};

	componentDidMount() {
		this.id = windowManager.addWindow(this.props.name, this.props.icon, {
			minimized: this.props.window.minimized || false,
		});

		windowManager.emitter.on("minimizeWindow", ({ id }) => {
			this.props.event("setWindowState", {
				minimized: true,
				position: this.state.position,
				size: this.state.size,
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
				size: this.state.size,
			});
			if (id === this.id) {
				this.moveToTop();
				this.setState({ collaps: false, isActive: true });
			} else this.setState({ isActive: false });
		});
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

	componentWillUnmount = () => {
		windowManager.closeWindow(this.id);
	};

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
			window: windowSizes,
		} = this.props;
		const { maxHeight, maxWidth, minHeight, minWidth } = {
			...defualtWindowSize,
			...windowSizes,
		};
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
							size: this.state.size,
						});
					}}
				>
					<div className={classes.root} onClick={() => this.moveToTop()}>
						<ResizableBox
							width={size.width}
							height={size.height}
							onResize={(_e: null, resize: { size: Size }) =>
								this.setState({ size: resize.size })
							}
							onResizeStop={() =>
								event("setWindowState", {
									position: this.state.position,
									minimized: this.state.collaps,
									size: this.state.size,
								})
							}
							minConstraints={[minWidth, minHeight]}
							maxConstraints={[maxWidth, maxHeight]}
						>
							<div
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
											isActive
												? classes.barButtonExit
												: classes.barButtonInactive
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
							{!collaps && <div className={classes.body}>{children}</div>}
						</ResizableBox>
					</div>
				</Dragable>
			</div>,
			this.domContainer
		);
	}
}

export default withStyles(styles, { withTheme: true })(Window);
