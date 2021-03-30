import React from "react";
import { Component } from "@react-fullstack/fullstack";
import WindowInterface, {
	WindowState as LocalWindowState,
} from "@web-desktop-environment/interfaces/lib/views/Window";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import ReactDOM from "react-dom";
import windowManager from "@state/WindowManager";
import { windowsBarHeight as desktopWindowsBarHeight } from "@views/Desktop";
import Icon from "@components/icon";
import { Rnd, RndDragCallback } from "react-rnd";
import { ConnectionContext } from "@root/contexts";
import { lastTaskQueuer } from "@utils/tasks";

export const defaultWindowSize = {
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
			width: "100%",
			height: "100%",
		},
		bar: {
			background: theme.windowBarColor,
			backdropFilter: theme.type === "transparent" ? "blur(15px)" : "none",
			border: theme.windowBorder
				? `1px solid ${theme.windowBorderColor}`
				: "none",
			borderBottom: "none",
			borderRadius: "7px 7px 0 0",
			cursor: "move",
			display: "flex",
			flexDirection: "row-reverse",
			height: windowBarHeight,
			width: "100%",
			justifyContent: "space-between",
		},
		smoothMove: {
			transition: "top 305ms, left 305ms",
		},
		barCollapse: {
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
		barButtonCollapse: {
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

interface WindowState {
	canDrag: boolean;
	collapse: boolean;
	isActive?: boolean;
	localWindowState?: LocalWindowState;
	useLocalWindowState: boolean;
	isResizing: boolean;
	zIndex?: number;
	fullscreenMode?: boolean;
}

class Window extends Component<
	WindowInterface,
	WindowState,
	WithStyles<typeof styles>
> {
	domContainer: Element;
	id!: number;
	wrapperRef?: HTMLDivElement;

	constructor(props: Window["props"]) {
		super(props);
		this.state = {
			canDrag: false,
			collapse: props.window.minimized || false,
			useLocalWindowState: false,
			isResizing: false,
		};

		this.domContainer = document.createElement("div");
		document.getElementById("app")?.appendChild(this.domContainer);
	}

	static contextType = ConnectionContext;

	context!: React.ContextType<typeof ConnectionContext>;

	getPosition = () => {
		const { position, size } = this.windowProperties;
		if (position && size) {
			if (position.x > window.innerWidth - size.width) {
				position.x = window.innerWidth - (position.x % window.innerWidth);
			}
			if (position.x < 0) {
				position.x = 0;
			}
			if (position.y > window.innerHeight - desktopWindowsBarHeight) {
				position.y = window.innerHeight - desktopWindowsBarHeight;
			}
			if (position.y < 0) {
				position.y = 0;
			}
			return position;
		} else {
			return {
				x: window.screen.availWidth / 3,
				y: window.screen.availHeight / 3,
			};
		}
	};

	private intervalsToClear: NodeJS.Timeout[] = [];

	private willUnmount = false;

	componentDidMount() {
		this.updateWindowPositionORSizeQueuer.start();
		windowManager.emitter.on("minimizeWindow", ({ id }) => {
			this.props.setWindowState({
				minimized: true,
			});
			if (id === this.id) {
				this.setState({ collapse: true, isActive: true });
			} else this.setState({ isActive: false });
		});

		windowManager.emitter.on("maximizeWindow", ({ id }) => {
			this.props.setWindowState({
				minimized: false,
			});
			if (id === this.id) {
				this.setState({ collapse: false, isActive: true });
			} else this.setState({ isActive: false });
		});
		windowManager.emitter.on("setActiveWindow", ({ id }) => {
			if (id === this.id) {
				this.setState({ isActive: true });
			} else {
				this.setState({ isActive: false });
			}
		});
		windowManager.emitter.on("updateZIndex", ({ id, layer }) => {
			if (id === this.id) {
				this.setState({ zIndex: layer });
			}
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
		this.id = windowManager.addWindow(this.props.name, this.props.icon, {
			minimized: this.props.window.minimized || false,
		});
		windowManager.reloadWindowsLayers();

		this.intervalsToClear.push(
			setInterval(() => {
				const activeElement = document.activeElement;
				if (
					this.wrapperRef &&
					activeElement &&
					!this.state.isActive &&
					this.wrapperRef.contains(activeElement)
				) {
					this.setActive();
				}
			}, 50)
		);
		const switchPosition = () => {
			if (!this.willUnmount) {
				this.switchToAbsolutePosition();
				window.requestAnimationFrame(switchPosition);
			}
		};
		switchPosition();
	}

	componentWillUnmount = () => {
		this.willUnmount = true;
		windowManager.closeWindow(this.id);
		this.intervalsToClear.forEach(clearInterval);
	};

	handleClickOutside = () => {
		this.setState({ isActive: false });
	};

	setActive = () => {
		if (windowManager.activeWindowId === this.id) {
			this.setState({ isActive: true });
		} else {
			windowManager.setActiveWindow(this.id);
		}
	};

	get serverWindowProperties() {
		return {
			size:
				this.props.window.width && this.props.window.height
					? {
							width: this.props.window.width,
							height: this.props.window.height,
					  }
					: undefined,
			position: this.props.window.position,
		};
	}

	get windowProperties() {
		if (this.state.useLocalWindowState) {
			return this.state.localWindowState || this.serverWindowProperties;
		} else {
			return this.serverWindowProperties;
		}
	}

	updateWindowPositionORSizeQueuer = lastTaskQueuer();

	/**
	 * update window size or position locally on remotely
	 */
	async setWindowState(state: LocalWindowState) {
		this.setState({
			localWindowState: { ...this.state.localWindowState, ...state },
		});

		this.updateWindowPositionORSizeQueuer.queueTask(() =>
			this.props.setWindowState(state)
		);
	}

	toggleWindowsMaximize = (forceOn?: boolean) => {
		const {
			props: {
				window: { allowFullscreen },
			},
			state: { fullscreenMode },
		} = this;
		if (allowFullscreen) {
			const newState = forceOn || !fullscreenMode;
			this.setState({ fullscreenMode: newState });
		}
	};

	/**
	 * static constance window properties to use when we are in fullscreen mode
	 */
	static fullscreenWindowSize = {
		width: "100%",
		height: `calc(100% - ${
			desktopWindowsBarHeight + 10 /* add 5 to account for margin */
		}px)`,
	};
	static fullscreenWindowPosition = { x: 0, y: 0 };

	/*
	 *	we are removing the translation base position and replace it with an absolute position using top and left
	 *	css properties in the render we need to avoid using translation base position since it is causing blurriness in iframes
	 */
	switchToAbsolutePosition = () => {
		const rndElement = document.getElementsByClassName(
			this.randomClassNameForRndContainer
		)[0] as HTMLDivElement;
		rndElement.style.transform = "";
	};

	randomClassNameForRndContainer = `rndElement${Math.random()}`;

	previousDelta = { width: 0, height: 0 };

	/**
	 * calculate window position
	 */
	getTopAndLeftPosition() {
		if (this.state.fullscreenMode) {
			return {
				top: 0,
				left: 0,
			};
		}
		const position = this.getPosition();
		return {
			top: position.y,
			left: position.x,
		};
	}

	onDrag: RndDragCallback = (e, newPosition) => {
		this.setActive();
		const { isResizing } = this.state;
		if (isResizing) {
			return;
		}

		const position = this.getPosition();
		const windowProperties = this.windowProperties;
		const size = {
			height: windowProperties.size?.height || defaultWindowSize.height,
			width: windowProperties.size?.width || defaultWindowSize.width,
		};
		const { clientX, clientY } = e as MouseEvent;

		const updatedPosition = {
			x: position.x + newPosition.deltaX,
			y: position.y + newPosition.deltaY,
		};

		// snap window drag to mouse
		if (updatedPosition.x > clientX) {
			updatedPosition.x = clientX;
		}
		if (updatedPosition.x < clientX - size.width) {
			updatedPosition.x = clientX - size.width;
		}
		if (updatedPosition.y > clientY - windowBarHeight) {
			updatedPosition.y = clientY - windowBarHeight;
		}
		if (updatedPosition.y < clientY) {
			updatedPosition.y = clientY;
		}

		// calculate if the window is touching one of the screen borders
		const touchTop = updatedPosition.y < -windowBarHeight / 3; // need to go a bit over the edge to go fullscreen
		const touchBottom =
			updatedPosition.y >
			window.innerHeight - windowBarHeight - desktopWindowsBarHeight;
		const width = Number(String(size.width).replace("px", ""));
		const touchMinimumLeft = updatedPosition.x < 0;
		const touchMinimumRight = updatedPosition.x > window.innerWidth - width;

		// in case the window touches the screen upper edge toggle fullscreen mode
		if (touchTop) {
			this.toggleWindowsMaximize(true);
			return;
		}

		// in case the window touches any other corner we should prevent it from moving further
		if (touchBottom || touchMinimumLeft || touchMinimumRight) {
			return;
		}
		this.setWindowState({
			position: updatedPosition,
		});
	};

	render() {
		const {
			canDrag,
			collapse,
			isActive,
			zIndex,
			fullscreenMode,
			useLocalWindowState,
			isResizing,
		} = this.state;
		const isDragging = useLocalWindowState && !isResizing;
		const {
			children,
			classes,
			title,
			icon,
			onClose,
			window: windowSizes,
		} = this.props;
		const windowProperties = this.windowProperties;
		const { maxHeight, maxWidth, minHeight, minWidth } = {
			...defaultWindowSize,
			...windowSizes,
		};
		const size = {
			height: windowProperties.size?.height || defaultWindowSize.height,
			width: windowProperties.size?.width || defaultWindowSize.width,
		};
		const position = this.getPosition();
		return ReactDOM.createPortal(
			<div
				ref={(element) => {
					if (element) this.wrapperRef = element;
				}}
			>
				<Rnd
					className={`${this.randomClassNameForRndContainer} ${
						useLocalWindowState ? "" : classes.smoothMove
					}`}
					disableDragging={!canDrag}
					size={fullscreenMode ? Window.fullscreenWindowSize : size}
					position={fullscreenMode ? Window.fullscreenWindowPosition : position}
					onDrag={this.onDrag}
					onDragStart={(e) => {
						if (fullscreenMode) {
							const { clientX, clientY } = e as MouseEvent;
							this.setState({
								useLocalWindowState: true,
								localWindowState: {
									position: {
										x: clientX - size.width / 2,
										y: clientY + windowBarHeight / 2,
									},
									size,
								},
								fullscreenMode: false,
							});
						} else {
							this.setState({
								useLocalWindowState: true,
								localWindowState: {
									position,
									size,
								},
							});
						}
					}}
					onDragStop={() => {
						this.props.setWindowState({ position }).then(() => {
							this.setState({
								useLocalWindowState: false,
								localWindowState: undefined,
							});
						});
					}}
					defaultSize={size}
					maxHeight={collapse ? windowBarHeight : maxHeight}
					maxWidth={maxWidth}
					minHeight={
						collapse
							? windowBarHeight
							: fullscreenMode
							? Window.fullscreenWindowSize.height
							: minHeight
					}
					minWidth={
						fullscreenMode ? Window.fullscreenWindowSize.width : minWidth
					}
					onResizeStart={() =>
						this.setState({
							useLocalWindowState: true,
							localWindowState: {
								position,
								size,
							},
							fullscreenMode: false,
							isResizing: true,
						})
					}
					onResizeStop={() => {
						this.previousDelta = { height: 0, width: 0 };
						this.props.setWindowState({ position, size }).then(() => {
							this.setState({
								useLocalWindowState: false,
								isResizing: false,
								localWindowState: undefined,
							});
						});
					}}
					onResize={(e, dir, ele, delta, _) => {
						switch (dir) {
							case "top": {
								position.y -= delta.height - this.previousDelta.height;
								break;
							}
							case "left": {
								position.x -= delta.width - this.previousDelta.width;
								break;
							}
							case "topLeft": {
								position.y -= delta.height - this.previousDelta.height;
								position.x -= delta.width - this.previousDelta.width;
								break;
							}
						}
						this.setWindowState({
							size: {
								width: size.width + delta.width - this.previousDelta.width,
								height: size.height + delta.height - this.previousDelta.height,
							},
							position: {
								...position,
							},
						});
						this.previousDelta = delta;
					}}
					style={{ zIndex, ...this.getTopAndLeftPosition() }}
				>
					<div className={classes.root} onClick={() => this.setActive()}>
						<div
							onMouseEnter={() => this.setState({ canDrag: true })}
							onMouseLeave={() => this.setState({ canDrag: false })}
							onDoubleClick={() => this.toggleWindowsMaximize()}
							className={`${classes.bar} ${
								collapse || isDragging ? classes.barCollapse : ""
							}`}
						>
							<div className={classes.barButtonsContainer}>
								<div
									onClick={() => {
										windowManager.updateState(this.id, {
											minimized: !collapse,
										});
									}}
									className={`${classes.barButton} ${
										isActive
											? classes.barButtonCollapse
											: classes.barButtonInactive
									}`}
								/>
								<div
									className={`${classes.barButton} ${
										isActive ? classes.barButtonExit : classes.barButtonInactive
									}`}
									onClick={() => {
										onClose();
									}}
								/>
							</div>
							<div className={classes.barTitle}>
								{title} -{" "}
								{icon.type === "icon" ? (
									<Icon
										containerClassName={classes.barTitleIcon}
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

						<div
							className={classes.body}
							style={isDragging || collapse ? { display: "none" } : {}}
						>
							{children}
						</div>
					</div>
				</Rnd>
			</div>,
			this.domContainer
		);
	}
}

export default withStyles(styles, { withTheme: true })(Window);
