import DesktopInterface, {
	App,
} from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { Component } from "@react-fullstack/fullstack";
import React, { useState, useEffect } from "react";
import {
	withStyles,
	createStyles,
	WithStyles,
	makeStyles,
} from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { reactFullstackConnectionManager } from "@root/index";
import TextField from "@components/textField";
import Icon from "@components/icon";
import windowManager from "@state/WindowManager";
import MountUnmountAnimation from "@components/mountUnmountAnimation";
import { Link } from "react-router-dom";
import { Client } from "@react-fullstack/fullstack-socket-client";
import { ConnectionContext } from "@root/contexts";
import StateComponent from "@components/stateComponent";
import { transparent } from "@utils/colors";
import { connect as connectToBroadway } from "@root/gtk-broadway-display/index";
import {
	GTKBridgeEmitter,
	status as GTKConnectionStatus,
} from "@root/gtk-broadway-display/state";
import { isMobile } from "@utils/environment";

export const windowsBarHeight = 55;

const styles = (theme: Theme) =>
	createStyles({
		root: {
			position: "absolute",
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
		},
		switchToNativeButton: {
			position: "absolute",
			top: 10 - windowsBarHeight,
			transition: "top 300ms",
			right: 45,
			height: windowsBarHeight,
			cursor: "pointer",
			width: 80,
			borderRadius: "0 0 15px 15px",
			fontSize: 40,
			paddingTop: 5,
			borderBottom: "none",
			display: "flex",
			justifyContent: "center",
			color: theme.background.text,
			boxShadow: `0 0px 3px 0px ${theme.shadowColor}`,
			border: `1px solid ${theme.transparentBorder || "#eee2"}`,
			backdropFilter: "blur(10px)",
			background: transparent(
				theme.background.transparent || theme.background.main,
				theme.type === "transparent" ? 0.15 : 0.6
			),
			"&:hover": {
				top: 0,
				background: theme.background.transparent,
			},
			zIndex: windowManager.windowsMinMaxLayer.max + 1,
		},
		"@keyframes slideIn": {
			"0%": {
				transform: "translateX(-100%)",
			},
			"100%": {
				transform: "translateX(0%)",
			},
		},
		"@keyframes slideOut": {
			"0%": {
				transform: "translateX(0%)",
			},
			"100%": {
				transform: "translateX(-100%)",
			},
		},
		slideIn: {
			animation: "$slideIn 200ms",
		},
		slideOut: {
			animation: "$slideOut 200ms",
		},
		startMenu: {
			position: "absolute",
			zIndex: windowManager.windowsMinMaxLayer.max + 1,
			bottom: 105,
			left: 15,
			width: 500,
			height: 500,
			maxHeight: "calc(100% - 105px - 5px)",
			maxWidth: "calc(100% - 15px - 5px)",
			overflowY: "auto",
			padding: 5,
			borderRadius: 10,
			border: `1px solid ${theme.transparentBorder || "#eee2"}`,
			backdropFilter: "blur(10px)",
			background: transparent(
				theme.background.transparent || theme.background.main,
				theme.type === "transparent" ? 0.15 : 0.6
			),
			boxShadow: "-5px 6px 10px -1px #0007",
			transition: "width 400ms, left 400ms, bottom 400ms, height 400ms",
		},
		"@media (max-width: 768px)": {
			startMenu: {
				width: "100%",
				height: "100%",
				left: 0,
				maxWidth: "calc(100% - 5px)",
				maxHeight: "calc(100% - 60px - 5px)",
				bottom: 60,
				borderRadius: 0,
			},
		},
		startMenuBody: {
			width: "100%",
			height: "100%",
			marginTop: 20,
		},
		appList: {
			margin: 7,
		},
		appCell: {
			minHeight: 54,
			padding: 10,
			marginTop: 15,
			boxSizing: "border-box",
			borderBottom: `1px solid ${theme.windowBorderColor}`,
			display: "flex",
			borderRadius: 7,
			color: theme.background.text,
			cursor: "pointer",
			boxShadow: `-1px 2px 20px 2px ${theme.shadowColor}`,
			"&:hover": {
				background: theme.background.transparentDark || theme.background.dark,
			},
		},
		appIcon: {
			flexShrink: 0,
			width: 50,
			height: 50,
			fontSize: 50,
		},
		appContent: {
			textAlign: "left",
			marginLeft: 10,
			overflow: "hidden",
			flexGrow: 1,
		},
		appName: {
			fontSize: "x-large",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
		},
		startMenuSearch: {
			width: "100%",
		},
	});

const useWindowBarStyles = makeStyles(
	(theme: Theme) => ({
		windowsBar: {
			position: "absolute",
			animation: "$slideUp 1s",
			left: 120,
			right: 120,
			borderRadius: 13,
			bottom: 5,
			height: windowsBarHeight,
			display: "flex",
			border: `1px solid ${theme.transparentBorder || "#eee2"}`,
			backdropFilter: "blur(10px)",
			background: transparent(
				theme.background.transparent || theme.background.main,
				theme.type === "transparent" ? 0.15 : 0.6
			),
			paddingLeft: 10,
			boxShadow: "0 0px 3px 0px",
			zIndex: windowManager.windowsMinMaxLayer.max + 1,
			overflowX: "auto",
			overflowY: "hidden",
			transition: "left 600ms, right 600ms, border-radius 600ms",
		},
		"@keyframes slideUp": {
			from: {
				bottom: -windowsBarHeight - 5,
			},
			to: {
				bottom: 5,
			},
		},
		windowsBarButton: {
			userSelect: "none",
			fontSize: 40,
			boxShadow: "0px 0px 10px 4px #0007",
			transition: "border-bottom 100ms",
			padding: 5,
			margin: 2,
			borderRadius: 6,
			marginRight: 5,
			marginLeft: 5,
			cursor: "pointer",
			color: theme.background.text,
			"&:hover": {
				background: theme.background.transparentDark || theme.background.dark,
			},
		},
		windowsBarButtonHover: {
			position: "absolute",
			transform: "translateY(-150%) translateX(-33%)",
			width: 200,
			height: 150,
			borderRadius: 6,
			fontSize: 20,
			background: `${theme.background.main} !important`,
			border: `solid 1px ${theme.windowBorderColor}`,
			textAlign: "center",
			animation: "$scaleUp 300ms",
			display: "flex",
			flexDirection: "column",
		},
		"@keyframes scaleUp": {
			from: {
				opacity: 0,
				width: 150,
				height: 130,
				borderRadius: 0,
			},
			to: {
				opacity: 1,
				width: 200,
				height: 150,
				borderRadius: 8,
			},
		},
		windowsBarButtonActive: {
			backdropFilter: "blur(15px)",
			borderBottom: `${
				theme.type === "transparent" ? theme.success.main : theme.secondary.main
			} solid 6px !important`,
		},
		windowsBarButtonOpen: {
			borderBottom: `${
				theme.type === "transparent" ? theme.success.main : theme.secondary.main
			} solid 3px`,
		},
		windowsBarButtonCloseMinimized: {
			borderBottom: `${theme.secondary.dark} solid 3px`,
		},
		"@media (min-width: 768px) and (max-width: 1024px)": {
			windowsBar: {
				left: 50,
				right: 50,
			},
		},
		"@media (max-width: 768px)": {
			windowsBar: {
				left: 0,
				right: 0,
				bottom: 0,
				height: windowsBarHeight + 5,
				borderRadius: 0,
			},
			windowsBarButton: {
				borderRadius: 0,
				boxShadow: "none",
				backdropFilter: "blur(9px)",
			},
		},
	}),
	{ name: "WindowBar" }
);

class Desktop extends Component<
	DesktopInterface,
	{},
	WithStyles<typeof styles>
> {
	renderAppListCell = (app: App, index: number, closeMenu: () => void) => {
		const { classes, onLaunchApp } = this.props;
		return (
			<div
				key={index}
				className={classes.appCell}
				onClick={() => {
					if (app) {
						closeMenu();
						onLaunchApp({ name: app.appName, params: {} });
					}
				}}
			>
				{app.icon.type === "img" ? (
					<img alt={`${app.displayName} icon`} src={app.icon.icon} />
				) : (
					<Icon className={classes.appIcon} name={app.icon.icon}></Icon>
				)}
				<div className={classes.appContent}>
					<div className={classes.appName}>{app.displayName}</div>
					<div>{app.description}</div>
				</div>
			</div>
		);
	};

	willUnmount = false;

	componentWillUnmount = () => {
		this.willUnmount = true;
	};

	componentDidMount = () => {
		GTKBridgeEmitter.on("status", () => {
			this.forceUpdate();
		});

		window.addEventListener(
			"resize",
			() => !this.willUnmount && this.forceUpdate()
		);

		this.tryToStartGtkServer();
	};

	componentDidUpdate = () => {
		this.tryToStartGtkServer();
	};

	tryToStartGtkServer = () => {
		if (!isMobile()) {
			const { gtkBridge } = this.props;
			if (GTKConnectionStatus === "disconnected" && gtkBridge) {
				try {
					connectToBroadway(
						reactFullstackConnectionManager.host,
						reactFullstackConnectionManager.https,
						gtkBridge.port
					);
				} catch (e) {
					/* no handle */
				}
			}
		}
	};

	render() {
		const { background, openApps, classes, apps } = this.props;
		return (
			<div className={classes.root} style={{ background }}>
				{openApps.map((app) => (
					<ConnectionContext.Provider
						key={app.id}
						value={{
							host: reactFullstackConnectionManager.host,
							port: app.port,
						}}
					>
						<Client<{}>
							key={app.id}
							{...reactFullstackConnectionManager.connect(
								app.port,
								"webWindow"
							)}
						/>
					</ConnectionContext.Provider>
				))}
				{!isMobile() && (
					<Link to="/native">
						<div className={classes.switchToNativeButton}>
							<Icon width={40} height={40} name="VscWindow" />
						</div>
					</Link>
				)}
				<StateComponent
					defaultState={{ isStartMenuOpen: false, startMenuQuery: "" }}
				>
					{({ isStartMenuOpen, startMenuQuery }, setState) => {
						return (
							<>
								<WindowBar
									isStartMenuOpen={isStartMenuOpen}
									toggleStartMenu={() =>
										setState({
											isStartMenuOpen: !isStartMenuOpen,
										})
									}
								/>
								<MountUnmountAnimation
									mount={isStartMenuOpen}
									className={`${classes.startMenu} ${
										isStartMenuOpen ? classes.slideIn : classes.slideOut
									}`}
								>
									<div className={classes.startMenuBody}>
										<TextField
											className={classes.startMenuSearch}
											borderBottom={false}
											placeholder="search app"
											value={startMenuQuery}
											onChange={(startMenuQuery) =>
												setState({ startMenuQuery })
											}
										></TextField>
										{apps
											.filter((app) =>
												startMenuQuery
													? app.displayName.includes(startMenuQuery) ||
													  app.description.includes(startMenuQuery) ||
													  app.appName.includes(startMenuQuery)
													: true
											)
											.map((app, index) =>
												this.renderAppListCell(app, index, () =>
													setState({ isStartMenuOpen: false })
												)
											)}
									</div>
								</MountUnmountAnimation>
							</>
						);
					}}
				</StateComponent>
			</div>
		);
	}
}

export const WindowBar = ({
	toggleStartMenu,
	isStartMenuOpen,
}: {
	toggleStartMenu: () => void;
	isStartMenuOpen: boolean;
}) => {
	const classes = useWindowBarStyles();
	const [openWindows, setOpenWindows] = useState(windowManager.windows);
	const [selectedButton, setSelectedButton] = useState<number | undefined>(
		undefined
	);
	useEffect(() => {
		const updateWindow = () => setOpenWindows([...windowManager.windows]);
		updateWindow();
		windowManager.emitter.on("addWindow", updateWindow);
		windowManager.emitter.on("closeWindow", updateWindow);
		windowManager.emitter.on("maximizeWindow", updateWindow);
		windowManager.emitter.on("minimizeWindow", updateWindow);
		windowManager.emitter.on("setActiveWindow", updateWindow);
	}, []);
	return (
		<div className={classes.windowsBar}>
			<div
				className={`${classes.windowsBarButton} ${
					!isStartMenuOpen
						? classes.windowsBarButtonCloseMinimized
						: classes.windowsBarButtonOpen
				} ${isStartMenuOpen ? classes.windowsBarButtonActive : ""}`}
				onClick={() => toggleStartMenu()}
			>
				<Icon width={40} height={40} name="FcList" />
			</div>
			{openWindows.map((openWindow, index) => (
				<div
					key={index}
					onContextMenu={() =>
						index === selectedButton
							? setSelectedButton(undefined)
							: setSelectedButton(index)
					}
					className={`${classes.windowsBarButton} ${
						openWindow.state.minimized
							? classes.windowsBarButtonCloseMinimized
							: classes.windowsBarButtonOpen
					} ${
						openWindow.id === windowManager.activeWindowId &&
						!openWindow.state.minimized
							? classes.windowsBarButtonActive
							: ""
					}`}
					onClick={() => {
						if (windowManager.activeWindowId === openWindow.id) {
							windowManager.updateState(openWindow.id, {
								minimized: !openWindow.state.minimized,
							});
						} else {
							windowManager.updateState(openWindow.id, {
								minimized: false,
							});
						}
					}}
				>
					{openWindow.icon.type === "img" ? (
						<img
							alt={`${openWindow.name} icon`}
							src={openWindow.icon.icon}
							width={40}
							height={40}
						/>
					) : (
						<Icon name={openWindow.icon.icon} />
					)}
					{selectedButton === index && (
						<div
							onClick={() => setSelectedButton(undefined)}
							className={`${classes.windowsBarButton} ${
								openWindow.state.minimized
									? classes.windowsBarButtonCloseMinimized
									: classes.windowsBarButtonOpen
							} ${
								openWindow.id === windowManager.activeWindowId
									? classes.windowsBarButtonActive
									: ""
							} ${classes.windowsBarButtonHover}`}
						>
							{openWindow.icon.type === "img" ? (
								<img
									alt={`${openWindow.name} icon`}
									src={openWindow.icon.icon}
									width={100}
									height={100}
								/>
							) : (
								<Icon size={100} name={openWindow.icon.icon} />
							)}
							<div>{openWindow.name}</div>{" "}
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default withStyles(styles, { name: "Desktop" })(Desktop);
