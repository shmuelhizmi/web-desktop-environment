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
import { Theme } from "@root/theme";
import { reactFullstackConnectionManager } from "@root/index";
import TextField from "@components/textField";
import Icon from "@components/icon";
import windowManager from "@state/WindowManager";
import MountUnmoutAnmiation from "@components/mountUnmoutAnimation";
import { Link } from "react-router-dom";
import { Client } from "@react-fullstack/fullstack-socket-client";
import { ConnectionContext } from "@root/contexts";

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
		startBotton: {
			position: "absolute",
			bottom: 0,
			left: 45,
			height: windowsBarHeight,
			cursor: "pointer",
			width: 80,
			borderRadius: "15px 15px 0 0",
			fontSize: 40,
			paddingTop: 5,
			borderBottom: "none",
			display: "flex",
			justifyContent: "center",
			color: theme.background.text,
			backdropFilter: "blur(15px)",
			border: `solid 2px ${
				theme.background.transparentDark || theme.background.dark
			}`,
			background: theme.background.main,
			"&:hover": {
				background: theme.background.transparent,
			},
			zIndex: 2,
		},
		switchToNativeButton: {
			position: "absolute",
			top: 0,
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
			backdropFilter: "blur(15px)",
			border: `solid 2px ${
				theme.background.transparentDark || theme.background.dark
			}`,
			background: theme.background.main,
			"&:hover": {
				background: theme.background.transparent,
			},
			zIndex: 2,
		},
		"@keyframes slidein": {
			"0%": {
				transform: "translateX(-100%)",
			},
			"100%": {
				transform: "translateX(0%)",
			},
		},
		"@keyframes slideout": {
			"0%": {
				transform: "translateX(0%)",
			},
			"100%": {
				transform: "translateX(-100%)",
			},
		},
		slidein: {
			animation: "$slidein 200ms",
		},
		slideout: {
			animation: "$slideout 200ms",
		},
		startMenu: {
			position: "absolute",
			zIndex: 2,
			bottom: 105,
			left: 15,
			width: 500,
			height: 500,
			maxHeight: "60%",
			maxWidth: "30%",
			overflowY: "auto",
			padding: 5,
			borderRadius: 10,
			background: theme.background.transparent || theme.background.main,
			backdropFilter: "blur(10px)",
			border: `solid 1px ${theme.background.transparent}`,
			boxShadow: "-5px 6px 10px -1px #0007",
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
		windowsBar: {
			position: "absolute",
			bottom: 0,
			left: 180,
			right: 25,
			borderRadius: "15px 15px 0 0",
			height: windowsBarHeight,
			display: "flex",
			backdropFilter: "blur(2px)",
			background: theme.background.transparent || theme.background.main,
			paddingLeft: 10,
			border: `solid 2px ${
				theme.background.transparentDark || theme.background.dark
			}`,
			borderBottom: "none",
			zIndex: 2,
		},
		windowsBarButton: {
			userSelect: "none",
			fontSize: 50,
			padding: 5,
			marginRight: 4,
			cursor: "pointer",
			color: theme.background.text,
			"&:hover": {
				background: theme.background.transparentDark || theme.background.dark,
			},
		},
		windowsBarButtonActive: {
			background: theme.background.transparentDark || theme.background.dark,
		},
		windowsBarButtonOpen: {
			borderBottom: `${
				theme.type === "transparent" ? theme.success.main : theme.secondary.main
			} solid 3px`,
		},
		windowsBarButtonCloseMinimized: {
			borderBottom: `${theme.secondary.dark} solid 3px`,
		},
	});

interface DesktopState {
	isStartMenuOpen: boolean;
	startMenuQuery?: string;
}

class Desktop extends Component<
	DesktopInterface,
	DesktopState,
	WithStyles<typeof styles>
> {
	constructor(props: Desktop["props"]) {
		super(props);
		this.state = {
			isStartMenuOpen: false,
		};
	}

	renderAppListCell = (app: App, index: number) => {
		const { classes, onLaunchApp } = this.props;
		return (
			<div
				key={index}
				className={classes.appCell}
				onClick={() => app && onLaunchApp({ flow: app.flow, params: {} })}
			>
				{app.icon.type === "img" ? (
					<img alt={`${app.name} icon`} src={app.icon.icon} />
				) : (
					<Icon className={classes.appIcon} name={app.icon.icon}></Icon>
				)}
				<div className={classes.appContent}>
					<div className={classes.appName}>{app.name}</div>
					<div>{app.description}</div>
				</div>
			</div>
		);
	};

	render() {
		const { background, openApps, classes, apps } = this.props;
		const { isStartMenuOpen, startMenuQuery } = this.state;
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
						<Client
							key={app.id}
							{...reactFullstackConnectionManager.connect(
								app.port,
								"webWindow"
							)}
						/>
					</ConnectionContext.Provider>
				))}
				<Link to="/native">
					<div className={classes.switchToNativeButton}>
						<Icon width={40} height={40} name="VscWindow" />
					</div>
				</Link>
				<div
					className={classes.startBotton}
					onClick={() => this.setState({ isStartMenuOpen: !isStartMenuOpen })}
				>
					<Icon width={40} height={40} name="FiList" />
				</div>
				<WindowBar />
				<MountUnmoutAnmiation
					mount={isStartMenuOpen}
					className={`${classes.startMenu} ${
						isStartMenuOpen ? classes.slidein : classes.slideout
					}`}
				>
					<div className={classes.startMenuBody}>
						<TextField
							className={classes.startMenuSearch}
							borderBottom={false}
							placeholder="search app"
							value={startMenuQuery}
							onChange={(startMenuQuery) => this.setState({ startMenuQuery })}
						></TextField>
						{apps
							.filter((app) =>
								startMenuQuery
									? app.name.includes(startMenuQuery) ||
									  app.description.includes(startMenuQuery) ||
									  app.flow.includes(startMenuQuery)
									: true
							)
							.map((app, index) => this.renderAppListCell(app, index))}
					</div>
				</MountUnmoutAnmiation>
			</div>
		);
	}
}

export const WindowBar = () => {
	const classes = makeStyles(styles)({});
	const [openWindows, setOpenWindows] = useState(windowManager.windows);
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
			{openWindows.map((openWindow, index) => (
				<div
					key={index}
					className={`${classes.windowsBarButton} ${
						openWindow.state.minimized
							? classes.windowsBarButtonCloseMinimized
							: classes.windowsBarButtonOpen
					} ${
						openWindow.id === windowManager.activeWindowId
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
							width={50}
							height={50}
						/>
					) : (
						<Icon name={openWindow.icon.icon} />
					)}
				</div>
			))}
		</div>
	);
};

export default withStyles(styles)(Desktop);
