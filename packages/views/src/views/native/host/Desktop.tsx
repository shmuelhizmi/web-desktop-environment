import React from "react";
import DesktopInterface from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { Client } from "@react-fullstack/fullstack-socket-client";
import { Component } from "@react-fullstack/fullstack";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@root/theme";
import TextField from "@components/textField";
import Icon from "@components/icon";
import windowManager, { Window } from "@state/WindowManager";
import { Icon as IconType } from "@web-desktop-environment/interfaces/lib/shared/icon";
import { ConnectionContext } from "@root/contexts";
import { reflowConnectionManager } from "@root/index";
import { Link } from "react-router-dom";
import { windowsBarHeight } from "@views/Desktop";

const styles = (theme: Theme) =>
	createStyles({
		root: {
			position: "absolute",
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
		},
		appContainer: {
			background: theme.background.transparent,
			overflowY: "auto",
			borderRadius: 10,
			boxShadow: "-5px 6px 10px -1px #0007",
			padding: 10,
			width: "90%",
			height: "90%",
		},
		hr: {
			border: `solid 1px ${theme.background.dark}`,
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
		appFilter: {
			height: 55,
		},
		appGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(80px, 120px))",
			margin: 15,
			justifyContent: "center",
			gridGap: 30,
			gridAutoRows: 100,
		},
		app: {
			borderBottom: `1px solid ${theme.windowBorderColor}`,
			borderRadius: 7,
			color: theme.secondary.text,
			cursor: "pointer",
			boxShadow: `-1px 2px 20px 1px ${theme.shadowColor}`,
			transition: "background 280ms, color 280ms, transform 450ms",
			"&:hover": {
				boxShadow: `0px 10px 10px 10px ${theme.shadowColor}`,
				background: theme.secondary.main,
				color: theme.secondary.text,
				transform: "scale(1.25) translateY(-20px)",
				backdropFilter: theme.type === "transparent" ? "blur(12px)" : "none",
			},
			height: 90,
			display: "flex",
			flexDirection: "column-reverse",
		},
		openApp: {
			borderBottom: `2px solid ${theme.secondary.main}`,
			"&:hover": {
				borderBottom: `2px solid ${theme.secondary.text}`,
			},
		},
		appIcon: {
			userSelect: "none",
			textAlign: "center",
			maxWidth: 100,
			fontSize: 50,
		},
		appName: {
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
			maxWidth: "100%",
			textAlign: "center",
			userSelect: "none",
		},
	});

interface DesktopState {
	openWindows: Window[];
	filterAppQuery: string;
}

class Desktop extends Component<
	DesktopInterface,
	DesktopState,
	WithStyles<typeof styles>
> {
	constructor(props: Desktop["props"]) {
		super(props);
		this.state = {
			openWindows: windowManager.windows,
			filterAppQuery: "",
		};
		windowManager.emitter.on("addWindow", this.updateWindow);
		windowManager.emitter.on("closeWindow", this.updateWindow);
		windowManager.emitter.on("maximizeWindow", this.updateWindow);
		windowManager.emitter.on("minimizeWindow", this.updateWindow);
	}

	updateWindow = () =>
		this.setState({ openWindows: [...windowManager.windows] });

	renderAppGrid = (
		app: { name: string; icon: IconType },
		isOpen: boolean,
		onClick: () => void,
		index: number
	) => {
		const { classes } = this.props;
		return (
			<div
				key={index}
				className={`${classes.app} ${isOpen ? classes.openApp : ""}`}
				onClick={onClick}
			>
				{app.icon.type === "img" ? (
					<img alt={`${app.name} icon`} src={app.icon.icon} />
				) : (
					<Icon className={classes.appIcon} name={app.icon.icon}></Icon>
				)}
				<div className={classes.appName}>{app.name}</div>
			</div>
		);
	};

	render() {
		const { background, openApps, classes, apps, onLaunchApp } = this.props;
		const { openWindows, filterAppQuery } = this.state;
		return (
			<div className={classes.root} style={{ background }}>
				{openApps.map((app, i) => (
					<ConnectionContext.Provider
						key={i}
						value={{ host: reflowConnectionManager.host, port: app.port }}
					>
						<Client
							{...reflowConnectionManager.connect(app.port, "nativeHost")}
						/>
					</ConnectionContext.Provider>
				))}
				<Link to="/">
					<div className={classes.switchToNativeButton}>
						<Icon width={40} height={40} name="VscMultipleWindows" />
					</div>
				</Link>
				<div className={classes.appContainer}>
					<TextField
						className={classes.appFilter}
						borderBottom={false}
						placeholder="search app"
						value={filterAppQuery}
						onChange={(filterAppQuery) => this.setState({ filterAppQuery })}
					></TextField>
					{openWindows.length !== 0 && (
						<>
							<div className={classes.appGrid}>
								{openWindows
									.filter((app) =>
										filterAppQuery ? app.name.includes(filterAppQuery) : true
									)
									.map((openWindow, index) =>
										this.renderAppGrid(
											openWindow,
											true,
											() =>
												windowManager.updateState(openWindow.id, {
													minimized: !openWindow.state.minimized,
												}),
											index
										)
									)}
							</div>
							<hr className={classes.hr} />
						</>
					)}
					<div className={classes.appGrid}>
						{apps
							.filter((app) =>
								filterAppQuery
									? app.name.includes(filterAppQuery) ||
									  app.description.includes(filterAppQuery) ||
									  app.flow.includes(filterAppQuery)
									: true
							)
							.map((app, index) =>
								this.renderAppGrid(
									app,
									false,
									() => app && onLaunchApp({ flow: app.flow, params: {} }),
									index
								)
							)}
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(Desktop);
