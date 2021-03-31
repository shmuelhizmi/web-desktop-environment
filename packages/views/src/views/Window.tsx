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
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
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

type WindowSnap = "fullscreen" | "right" | "left";

interface WindowState {
	canDrag: boolean;
	collapse: boolean;
	isActive?: boolean;
	localWindowState?: LocalWindowState;
	useLocalWindowState: boolean;
	isResizing: boolean;
	zIndex?: number;
	snap?: WindowSnap;
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

	percentageToNumber = (size: number | string, from: number) => {
		if (typeof size === "number") {
			return size;
		}
		return (100 / Number(size.replace("%", ""))) * from;
	};

	screenSizesToNumbers = () => {
		const { maxHeight, maxWidth, minHeight, minWidth } = this.props.window;
		return {
			maxHeight: this.percentageToNumber(
				maxHeight || defaultWindowSize.maxHeight,
				window.innerHeight
			),
			minHeight: this.percentageToNumber(
				minHeight || defaultWindowSize.minHeight,
				window.innerHeight
			),
			maxWidth: this.percentageToNumber(
				maxWidth || defaultWindowSize.maxWidth,
				window.innerWidth
			),
			minWidth: this.percentageToNumber(
				minWidth || defaultWindowSize.minWidth,
				window.innerWidth
			),
		};
	};

	getSize = () => {
		const size = { ...(this.windowProperties.size || {}) };
		const { collapse } = this.state;
		const {
			maxHeight,
			maxWidth,
			minHeight,
			minWidth,
		} = this.screenSizesToNumbers();
		if (size.height && size.width) {
			if (maxHeight < size.height) {
				size.height = maxHeight;
			}
			if (minHeight > size.height) {
				size.height = minHeight;
			}
			if (maxWidth < size.width) {
				size.width = maxWidth;
			}
			if (minWidth > size.width) {
				size.width = minWidth;
			}
			if (collapse) {
				size.height = windowBarHeight;
			}
			return size as { width: number; height: number };
		} else {
			return {
				width: defaultWindowSize.width,
				height: collapse ? windowBarHeight : defaultWindowSize.height,
			};
		}
	};

	getPosition = () => {
		const size = this.getSize();
		const { position } = this.windowProperties;
		const { useLocalWindowState } = this.state;
		if (position && size) {
			if (position.x < 0) {
				if (!useLocalWindowState) {
					position.x = -position.x;
				} else {
					position.x = 0;
				}
			}
			if (position.x > window.innerWidth - size.width) {
				if (!useLocalWindowState) {
					position.x =
						window.innerWidth -
						size.width -
						((window.innerWidth - size.width) % position.x);
				} else {
					position.x = window.innerWidth - size.width;
				}
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
	setWindowState(state: LocalWindowState) {
		this.setState({
			localWindowState: { ...this.state.localWindowState, ...state },
		});

		this.updateWindowPositionORSizeQueuer.queueTask(() =>
			this.props.setWindowState(state)
		);
	}

	snapWindow = (snap?: WindowSnap | undefined, forceState?: boolean) => {
		const {
			props: {
				window: { allowLocalScreenSnapping },
			},
			state: { snap: currentSnap, collapse },
		} = this;
		if (!collapse) {
			if (allowLocalScreenSnapping) {
				const snapNow = forceState !== undefined ? forceState : !currentSnap;
				this.setState({ snap: snapNow ? snap : undefined });
			}
		}
	};

	/**
	 * static constance window properties to use when we are in fullscreen mode
	 */
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

		const newStyles = this.getWindowTransformStyles();

		Object.keys(newStyles).map((keyNameAsString) => {
			const key = keyNameAsString as keyof typeof newStyles;
			const value = newStyles[key];
			if (typeof value === "number") {
				rndElement.style[key] = `${value}px`;
			} else if (typeof value === "string") {
				rndElement.style[key] = value;
			}
		});
	};

	randomClassNameForRndContainer = `rndElement${Math.random()}`;

	getWindowTransformStyles = () => {
		const position = this.getWindowPosition();
		const size = this.getWindowSize();
		return {
			top: position?.y || 0,
			left: position?.x || 0,
			height: size?.height,
			width: size?.width,
		};
	};

	onDrag: RndDragCallback = (e, newPosition) => {
		this.setActive();
		const { isResizing } = this.state;
		if (isResizing) {
			return;
		}

		const position = this.getPosition();
		const size = this.getSize();
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
			updatedPosition.y = clientY - windowBarHeight / 2;
		}

		// calculate if the window is touching one of the screen borders
		const touchTop = clientY < 2; // need to go a bit over the edge to go fullscreen
		const farFromTop = clientY > 50;
		const touchMinimumLeft = clientX < 25;
		const farFromMinimumLeft = clientX > 50;
		const touchMinimumRight = clientX > window.innerWidth - 25;
		const farFromMinimumRight = clientX < window.innerWidth - 50;

		// in case the window touches one of the screen edges snap to it
		if (touchTop) {
			this.snapWindow("fullscreen", true);
			return;
		}
		if (touchMinimumLeft) {
			this.snapWindow("left", true);
			return;
		}
		if (touchMinimumRight) {
			this.snapWindow("right", true);
			return;
		}

		if (farFromMinimumLeft && farFromMinimumRight && farFromTop) {
			this.snapWindow(undefined, false);
		}
		this.setWindowState({
			position: updatedPosition,
		});
	};
	onResize: RndResizeCallback = (e, dir, ele, delta) => {
		const position = this.getPosition();
		const { localWindowState, collapse } = this.state;
		if (localWindowState?.size) {
			const { size } = localWindowState;
			const {
				maxHeight,
				maxWidth,
				minHeight,
				minWidth,
			} = this.screenSizesToNumbers();
			const newSize = {
				width: size.width + delta.width - this.lastResizeDelta.width,
				height: size.height + delta.height - this.lastResizeDelta.height,
			};
			if (collapse) {
				newSize.height -= delta.height - this.lastResizeDelta.height;
			}
			switch (dir) {
				case "topRight":
				case "top": {
					if (newSize.height < maxHeight && newSize.height > minHeight) {
						position.y -= delta.height - this.lastResizeDelta.height;
					}
					break;
				}
				case "bottomLeft":
				case "left": {
					if (newSize.width < maxWidth && newSize.width > minWidth) {
						position.x -= delta.width - this.lastResizeDelta.width;
					}
					break;
				}
				case "topLeft": {
					if (newSize.height < maxHeight && newSize.height > minHeight) {
						position.y -= delta.height - this.lastResizeDelta.height;
					}
					if (newSize.width < maxWidth && newSize.width > minWidth) {
						position.x -= delta.width - this.lastResizeDelta.width;
					}
					break;
				}
			}
			this.setWindowState({
				size: newSize,
				position: {
					...position,
				},
			});
			this.lastResizeDelta = delta;
		}
	};

	getWindowSize = () => {
		const size = this.getSize();
		const { snap } = this.state;
		if (!snap) {
			return size;
		} else if (snap === "fullscreen") {
			return {
				width: "100%",
				height: `calc(100% - ${
					desktopWindowsBarHeight + 10 /* add 5 to account for margin */
				}px)`,
			};
		} else if (snap === "left" || snap === "right") {
			return {
				width: "50%",
				height: `calc(100% - ${
					desktopWindowsBarHeight + 10 /* add 5 to account for margin */
				}px)`,
			};
		}
	};

	getWindowPosition = () => {
		const position = this.getPosition();
		const { snap } = this.state;
		if (!snap) {
			return position;
		} else if (snap === "fullscreen" || snap === "left") {
			return {
				x: 0,
				y: 0,
			};
		} else if (snap === "right") {
			return {
				x: window.innerWidth / 2,
				y: 0,
			};
		}
	};

	shouldCollapse = () => {
		const { collapse, snap, useLocalWindowState, isResizing } = this.state;
		return collapse || (useLocalWindowState && !snap && !isResizing);
	};

	lastResizeDelta = { width: 0, height: 0 };

	render() {
		const {
			canDrag,
			collapse,
			isActive,
			zIndex,
			snap,
			useLocalWindowState,
		} = this.state;
		const { children, classes, title, icon, onClose } = this.props;
		const size = this.getSize();
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
					size={this.getWindowSize()}
					position={this.getWindowPosition()}
					onDrag={this.onDrag}
					onDragStart={(e) => {
						if (snap) {
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
								snap: undefined,
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
						this.setState({
							useLocalWindowState: false,
							localWindowState: undefined,
						});
					}}
					defaultSize={size}
					onResizeStart={() =>
						this.setState({
							useLocalWindowState: true,
							localWindowState: {
								position,
								size: size,
							},
							snap: undefined,
							isResizing: true,
						})
					}
					onResizeStop={() => {
						this.lastResizeDelta = { height: 0, width: 0 };
						this.setState({
							useLocalWindowState: false,
							isResizing: false,
							localWindowState: undefined,
						});
					}}
					onResize={this.onResize}
					style={{ zIndex, ...this.getWindowTransformStyles() }}
				>
					<div className={classes.root} onClick={() => this.setActive()}>
						<div
							onMouseEnter={() => this.setState({ canDrag: true })}
							onMouseLeave={() => this.setState({ canDrag: false })}
							onDoubleClick={() => this.snapWindow("fullscreen")}
							className={`${classes.bar} ${
								this.shouldCollapse() ? classes.barCollapse : ""
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
							style={this.shouldCollapse() ? { display: "none" } : {}}
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
