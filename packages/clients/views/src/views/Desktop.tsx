import DesktopInterface, {
	App,
} from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { Component } from "@react-fullstack/fullstack";
import React, { useState, useEffect } from "react";
import { withStyles, createStyles, WithStyles, makeStyles } from "@mui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import { reactFullstackConnectionManager } from "@root/index";
import TextField from "@components/textField";
import Icon from "@components/icon";
import windowManager, { Window } from "@state/WindowManager";
import MountUnmountAnimation from "@components/mountUnmountAnimation";
import { Client } from "@react-fullstack/fullstack-socket-client";
import { ConnectionContext } from "@root/contexts";
import StateComponent from "@components/stateComponent";
import { makeAppColor, transparent } from "@utils/colors";
import { connect as connectToBroadway } from "@root/gtk-broadway-display/index";
import {
	GTKBridgeEmitter,
	status as GTKConnectionStatus,
} from "@root/gtk-broadway-display/state";
import { isMobile } from "@utils/environment";
import { useSwipeable, SwipeEventData } from "react-swipeable";
import { MenuBar } from "@components/menubar";
import { MenuBarLinkContext } from "@root/hooks/MenuBarItemPortal";
import { EntryPointProps } from "@web-desktop-environment/interfaces/lib/web/sdk";
import {
	getUrl,
	ProvideViews,
	useTheme,
} from "@web-desktop-environment/web-sdk";
import { Service } from "./services";

export const windowsBarHeight = 65;

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
				theme.type === "transparent" ? 0.3 : 0.9
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
			left: 320,
			right: 320,
			borderRadius: 13,
			bottom: 5,
			height: windowsBarHeight - 10,
			padding: 5,
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
			alignItems: "center",
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
			transition: "outline 100ms",
			width: 40,
			height: 40,
			padding: 5,
			border: `0px solid ${theme.primary.transparent || theme.primary.main}`,
			outline: `0px solid ${theme.primary.main}`,
			margin: 2,
			borderRadius: 6,
			marginRight: 7,
			marginLeft: 7,
			cursor: "pointer",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			color: theme.background.text,
			"& span": {
				height: "min-content",
				width: "min-content",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			},
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
			border: `solid 0px ${theme.windowBorderColor}`,
			textAlign: "center",
			animation: "$scaleUp 300ms",
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
			outline: `${theme.primary.main} solid 2px !important`,
		},
		windowsBarButtonOpen: {
			outline: `${theme.primary.main} solid 1px`,
		},
		windowsBarButtonCloseMinimized: {},
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
		},
	}),
	{ name: "WindowBar" }
);

class Desktop extends Component<
	DesktopInterface,
	{ views: {}; isLoadingViews: boolean },
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
					<img
						alt={`${app.displayName} icon`}
						src={app.icon.icon}
						className={classes.appIcon}
					/>
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
		this.importPaths(this.props.externalViewsImportPaths);
	};

	componentDidUpdate = () => {
		this.tryToStartGtkServer();
	};

	shouldComponentUpdate = (
		nextProps: Desktop["props"],
		_nextState: Desktop["state"]
	) => {
		const { externalViewsImportPaths: currentExternalViewsImportPaths } =
			this.props;
		const { externalViewsImportPaths: nextExternalViewsImportPaths } =
			nextProps;
		const differentExternalViewsImportPaths =
			nextExternalViewsImportPaths.filter(
				(path) => !currentExternalViewsImportPaths.includes(path)
			);
		this.importPaths(differentExternalViewsImportPaths);
		return true;
	};

	importPaths = async (paths: string[]) => {
		if (paths.length === 0) {
			return;
		}
		this.setState({
			isLoadingViews: true,
		});
		await Promise.all(paths.map(this.importPath));
		this.setState({
			isLoadingViews: false,
		});
	};

	importPath = async (path: string) => {
		const { externalViewsHostDomain } = this.props;
		const importUrl = getUrl(externalViewsHostDomain, path);
		const { default: main } = (await this.importWithoutWebpack(importUrl)) as {
			default: (props: EntryPointProps) => any;
		};
		this.setState((state) => ({
			views: {
				...state.views,
				...main({
					packageBaseline: new URL(".", importUrl).href,
				}),
			},
		}));
	};

	// import es module and skip webpack
	importWithoutWebpack = async (path: string) => {
		return import(/* @vite-ignore */ path);
	};

	tryToStartGtkServer = () => {
		if (!isMobile()) {
			const { gtkBridge } = this.props;
			if (GTKConnectionStatus === "disconnected" && gtkBridge) {
				try {
					connectToBroadway(getUrl(gtkBridge.domain, "/socket", true));
				} catch (e) {
					/* no handle */
				}
			}
		}
	};

	state = { views: {}, isLoadingViews: false };

	menuBarRef = React.createRef<HTMLDivElement>();

	render() {
		const { background, openApps, classes, apps, servicesAppsDomains } =
			this.props;
		const { views, isLoadingViews } = this.state;
		return (
			<div className={classes.root} style={{ background }}>
				<MenuBar div={this.menuBarRef} />
				{!isLoadingViews &&
					openApps.map((app) => {
						const connection = reactFullstackConnectionManager.connect(
							"app-" + app.id,
							"webWindow"
						);
						const viewsToProvide = { ...connection.views, ...views };
						return (
							<ConnectionContext.Provider
								key={app.id}
								value={{
									host: reactFullstackConnectionManager.host,
									port: app.port,
								}}
							>
								<ProvideViews value={viewsToProvide}>
									<Client<{}>
										key={app.id}
										{...connection}
										views={viewsToProvide}
									/>
								</ProvideViews>
							</ConnectionContext.Provider>
						);
					})}
				<MenuBarLinkContext.Provider value={this.menuBarRef}>
					{!isLoadingViews ? (
						servicesAppsDomains.map((domain) => {
							const connection = reactFullstackConnectionManager.connect(
								domain,
								"serviceViews"
							);
							const viewsToProvide = { ...connection.views, ...views };
							return (
								<ProvideViews value={viewsToProvide} key={domain}>
									<Client<{}> {...connection} views={viewsToProvide} />
								</ProvideViews>
							);
						})
					) : (
						<Service
							icon={{ icon: "VscLoading", type: "icon" }}
							buttons={[]}
							onAction={() => null as any}
							text="Loading Desktop..."
						/>
					)}
				</MenuBarLinkContext.Provider>

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
	const theme = useTheme();
	const [openWindows, setOpenWindows] = useState(windowManager.windows);
	const [selectedButton, setSelectedButton] = useState<number | undefined>(
		undefined
	);
	const mobileView = isMobile();
	const onOpenWindow = (openWindow: Window) => {
		if (isStartMenuOpen) {
			toggleStartMenu();
		}
		if (windowManager.activeWindowId === openWindow.id) {
			windowManager.updateState(openWindow.id, {
				minimized: !openWindow.state.minimized,
			});
		} else {
			windowManager.updateState(openWindow.id, {
				minimized: false,
			});
		}
	};
	const onSwipeDocument = (dir: "left" | "right", e: SwipeEventData) => {
		if (!mobileView) {
			return;
		}
		let ele: HTMLElement | null = e.event.target as HTMLElement;
		while (ele) {
			const style = getComputedStyle(ele);
			const overflow = style.overflow;
			const overflowX = style.overflowX;
			if (
				(overflow === "auto" || overflowX === "auto") &&
				ele.scrollWidth > ele.offsetWidth
			) {
				return;
			}
			if (overflow === "scroll" || overflowX === "scroll") {
				return;
			}
			ele = ele.parentElement;
		}

		const windowToOpen = openWindows.find(
			(_, index) =>
				openWindows[
					(index + (dir === "right" ? 1 : openWindows.length - 1)) %
						openWindows.length
				].id === windowManager.activeWindowId
		);
		if (windowToOpen) {
			onOpenWindow(windowToOpen);
		}
	};
	const { ref: documentSwipeRef } = useSwipeable({
		onSwipedRight(e) {
			onSwipeDocument("right", e);
		},
		onSwipedLeft(e) {
			onSwipeDocument("left", e);
		},
	});
	const windowBarSwipable = useSwipeable({
		onSwipedUp() {
			toggleStartMenu();
		},
	});
	useEffect(() => {
		const updateWindow = () => setOpenWindows([...windowManager.windows]);
		updateWindow();
		windowManager.emitter.on("addWindow", updateWindow);
		windowManager.emitter.on("closeWindow", updateWindow);
		windowManager.emitter.on("maximizeWindow", updateWindow);
		windowManager.emitter.on("minimizeWindow", updateWindow);
		windowManager.emitter.on("setActiveWindow", updateWindow);
		windowManager.emitter.on("updateWindow", updateWindow);
		if (mobileView) {
			documentSwipeRef(document.body);
		}
	}, []);
	return (
		<div
			className={classes.windowsBar}
			{...windowBarSwipable}
			onDoubleClick={toggleStartMenu}
		>
			<div
				className={`${classes.windowsBarButton} ${
					!isStartMenuOpen
						? classes.windowsBarButtonCloseMinimized
						: classes.windowsBarButtonOpen
				} ${isStartMenuOpen ? classes.windowsBarButtonActive : ""}`}
				onClick={() => toggleStartMenu()}
				style={{ background: makeAppColor(theme.background.main) }}
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
					style={{ background: makeAppColor(theme.background.main) }}
					onClick={() => onOpenWindow(openWindow)}
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
