import React from "react";
import { Component } from "@react-fullstack/fullstack";
import SettingsInterface from "@web-desktop-environment/interfaces/lib/views/apps/system/Settings";
import {
	Settings as SettingsConfiguration,
	Color as ColorType,
} from "@web-desktop-environment/interfaces/lib/shared/settings";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Themes, Colors } from "@root/theme";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import StateComponent from "@components/stateComponent";
import Button from "@components/button";
import axios from "axios";
import Color from "@ctrl/tinycolor";
import { SketchPicker } from "react-color";
import { invertColor } from "@utils/colors";
import Icon from "@components/icon";

const makeColor = (baseColor: RGBArray | string): ColorType => {
	const color =
		typeof baseColor === "string"
			? Color(baseColor)
			: Color({ r: baseColor[0], g: baseColor[1], b: baseColor[2] });
	return {
		main: color.toHex8String(),
		dark: color.darken(0.25).toHex8String(),
		light: color.lighten(0.25).toHex8String(),
		text: Color(invertColor(color.toHexString())).darken(0.3).toHexString(),
		darkText: Color(invertColor(color.toHexString())).darken(0.5).toHexString(),
		transparentLight: color.isDark() ? "#fff" : "#444",
		transparent: color.setAlpha(color.getAlpha() * 0.6).toHex8String(),
		transparentDark: color.setAlpha(color.getAlpha() * 0.9).toHex8String(),
	};
};

const styles = (theme: Theme) =>
	createStyles({
		root: {
			background: theme.background.main,
			border: theme.windowBorder
				? `1px solid ${theme.windowBorderColor}`
				: "none",
			width: "100%",
			height: "100%",
			display: "flex",
			borderRadius: "0 0 9px 9px",
			boxShadow: `-10px 12px 20px -2px  ${theme.shadowColor}`,
			backdropFilter: theme.type === "transparent" ? "blur(3px)" : "none",
		},
		categorySelection: {
			background: theme.background.dark,
			borderRight: `solid 1px ${theme.windowBorderColor}`,
			backdropFilter: theme.type === "transparent" ? "blur(16px)" : "none",
			borderRadius: "0 0 0 10px",
			height: "100%",
			width: 280,
		},
		categorySelectIcon: {
			marginRight: 10,
			marginLeft: 10,
			transform: "translateY(5px)",
		},
		selectCategoryButton: {
			fontSize: "calc(1em + 1vmin)",
			paddingTop: 5,
			paddingBottom: 5,
			userSelect: "none",
			cursor: "pointer",
			width: "100%",
			display: "flex",
			alignItems: "center",
			borderBottom: `solid 1px ${theme.windowBorderColor}`,
			color: theme.background.text,
			"&:hover":
				theme.type === "transparent"
					? {
							backdropFilter: "blur(3px)",
					  }
					: {
							background: theme.background.main,
					  },
		},
		selectCategoryButtonSelected: {
			color: theme.secondary.text,
			background: `${theme.secondary.main} !important`,
		},
		"@media (max-width: 700px)": {
			categorySelection: {
				width: "100%",
			},
			selectCategoryButton: {
				fontSize: "calc(2em + 1vmin)",
			},
		},
		category: {
			width: "100%",
			maxHeight: "100%",
			overflowY: "auto",
			background: theme.background.main,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			borderRadius: "0 0 15px 0",
		},
		categoryTopBar: {
			display: "flex",
			width: "100%",
			alignItems: "center",
		},
		categoryBackButton: {
			width: 30,
			height: 30,
			minWidth: "30px !important",
			minHeight: "30px !important",
			margin: 5,
		},
		categoryTitle: {
			marginTop: 7,
			width: "90%",
			userSelect: "none",
			borderBottom: `solid 2px ${theme.background.transparent}`,
			color: theme.background.text,
			fontSize: "calc(1.5em + 2vmin)",
		},
		categorySubtitle: {
			width: "85%",
			margin: 9,
			userSelect: "none",
			borderBottom: `solid 1px ${theme.background.transparent}`,
			color: theme.background.text,
			fontSize: "calc(0.75em + 1vmin)",
		},
		marginBlock: {
			display: "flex",
			justifyContent: "center",
			flexDirection: "column",
			alignItems: "center",
			width: "100%",
			marginTop: 30,
			marginBottom: 10,
		},
		margin: {
			margin: 14,
		},
		settingsBlock: {
			width: "80%",
			border: `1px solid ${theme.windowBorderColor}`,
			background: theme.background.dark,
			padding: 20,
			borderRadius: 9,
		},
		settingsProperty: {
			width: "100%",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			fontSize: "calc(0.75em + 1vmin)",
			color: theme.background.darkText || theme.background.text,
			minHeight: 45,
			marginBottom: 5,
			borderBottom: `solid 1px ${theme.primary.transparent}`,
		},
		settingsPropertyCol: {
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "space-between",
		},
		settingsPropertyName: {},
		settingsPropertyNameCol: {
			fontSize: "calc(0.75em + 1vmin)",
		},
		settingsPropertyValueCol: {
			width: "100% !important",
			margin: 5,
			height: "auto",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
		},
		text: {
			fontSize: "calc(0.75em + 1vmin)",
			color: theme.background.text,
			margin: 5,
		},
		settingsPropertyValue: {
			wordBreak: "break-all",
			width: "50%",
			height: "100%",
			background: "transparent",
			textAlign: "center",
			"& input": {
				textAlign: "center",
				color: theme.background.darkText || theme.background.text,
				width: "100%",
				height: "100%",
				border: "none",
				borderBottom: `solid 1px ${theme.primary.transparent}`,
				outline: "none",
				fontSize: "calc(0.75em + 1vmin)",
				background: "transparent",
			},
			"& select": {
				textAlign: "center",
				color: theme.background.darkText || theme.background.text,
				width: "100%",
				height: "100%",
				border: "none",
				borderBottom: `solid 1px ${theme.primary.transparent}`,
				outline: "none",
				fontSize: "calc(0.75em + 1vmin)",
				background: "transparent",
				"& option": {
					textAlign: "center",
					background: theme.background.dark,
				},
			},
		},
		settingsPropertyValueError: {
			fontSize: 12,
			color: theme.error.main,
		},
		colorsTable: {
			display: "flex",
			justifyContent: "center",
		},
		color: {
			width: 30,
			height: 30,
			margin: 5,
			borderRadius: "50%",
			border: `solid 1px ${theme.windowBorderColor}`,
			"&:hover": {
				transform: "scale(1.2)",
			},
		},
		themeGrid: {
			width: "100%",
			display: "grid",
			padding: 20,
			boxShadow: `inset 0 0 20px 0px ${theme.shadowColor}`,
			justifyContent: "center",
			gridTemplateColumns: "repeat(auto-fit, minmax(80px, 180px))",
			gridGap: 15,
			gap: "15px",
		},
		themeButton: {
			height: 130,
		},
	});

type SettingsCategory = "desktop" | "network" | "systemInfo";

interface SettingsState {
	selectedCategory?: SettingsCategory;
	settings: SettingsConfiguration;
}

type ColormindResponse = {
	result: [RGBArray, RGBArray, RGBArray, RGBArray, RGBArray];
};
type RGBArray = [number, number, number];

class Settings extends Component<
	SettingsInterface,
	SettingsState,
	WithStyles<typeof styles>
> {
	constructor(props: Settings["props"]) {
		super(props);
		this.state = {
			settings: props.settings,
		};
	}

	generateCustomTheme = () => {
		axios
			.post<ColormindResponse>(
				"http://colormind.io/api/",
				JSON.stringify({ model: "default" })
			)
			.then((response) => {
				const colors = response.data.result;
				this.setState((state) => {
					state.settings.desktop.customTheme = {
						type: "custom",
						name: "custom",
						shadowColor: "#000",
						background: makeColor(colors[0]),
						primary: makeColor(colors[1]),
						secondary: makeColor(colors[2]),
						windowBorderColor: makeColor(colors[0]).text,
						success: makeColor(colors[3]),
						windowBarColor: Color({
							r: colors[4][0],
							g: colors[4][1],
							b: colors[4][2],
						}).toHex8String(),
						error: Themes.transparent.error,
						warning: Themes.transparent.warning,
						windowBorder: true,
					};
					this.props.setSettings(state.settings);
					return {
						settings: state.settings,
					};
				});
			});
	};

	renderDesktopCategory = () => {
		const { classes, setSettings } = this.props;
		const phoneMode = window.matchMedia("(max-width: 700px)").matches;
		return (
			<div className={classes.category}>
				<div className={classes.categoryTopBar}>
					{phoneMode && (
						<Button
							color="secondary"
							onClick={() => this.setState({ selectedCategory: undefined })}
							className={classes.categoryBackButton}
						>
							<Icon name="VscChevronLeft" />
						</Button>
					)}
					<div className={classes.categoryTitle}>Desktop Settings</div>
				</div>
				<div className={classes.marginBlock}>
					<div className={classes.settingsBlock}>
						<div className={classes.settingsProperty}>
							<div className={classes.settingsPropertyName}>background</div>
							<div className={classes.settingsPropertyValue}>
								<input
									type="text"
									value={this.state.settings.desktop.background}
									onChange={(e) => {
										const value = e.target.value;
										this.setState((state) => {
											state.settings.desktop.background = value;
											setSettings(state.settings);
											return {
												settings: state.settings,
											};
										});
									}}
								/>
							</div>
						</div>
						<div
							className={`${classes.settingsProperty} ${classes.settingsPropertyCol}`}
						>
							<div className={classes.settingsPropertyNameCol}>theme</div>
							<div className={classes.settingsPropertyValueCol}>
								<div
									className={classes.themeGrid}
									style={{
										background: this.state.settings.desktop.background,
									}}
								>
									{(Object.keys(Themes) as (keyof typeof Themes)[]).map(
										(key) => (
											<Button
												key={key}
												className={classes.themeButton}
												style={{
													background: Themes[key].background.main,
													color: Themes[key].background.text,
													boxShadow: `0 0 20px 0px ${Themes[key].shadowColor}`,
													backdropFilter:
														Themes[key].type === "transparent"
															? "blur(5px)"
															: "",
												}}
												onClick={() => {
													this.setState((state) => {
														state.settings.desktop.theme = key;
														setSettings(state.settings);
														return {
															settings: state.settings,
														};
													});
												}}
											>
												{Themes[key].name}
											</Button>
										)
									)}
								</div>
							</div>
						</div>
						{this.state.settings.desktop.theme === "custom" && (
							<>
								<div
									className={`${classes.settingsProperty} ${classes.settingsPropertyCol}`}
								>
									<div className={classes.settingsPropertyNameCol}>
										Custom Theme
									</div>
									<div
										className={`${classes.settingsPropertyValue} ${classes.settingsPropertyValueCol}`}
									>
										<Button border onClick={this.generateCustomTheme}>
											Genarate custom theme
										</Button>
									</div>
								</div>
								<div
									className={`${classes.settingsPropertyValue} ${classes.settingsPropertyValueCol}`}
								>
									{this.renderCreateCustomTheme()}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		);
	};

	renderCreateCustomTheme = () => {
		const { classes } = this.props;
		const { background, primary, secondary, error, success, warning } =
			this.props.settings.desktop.customTheme || Themes.transparent;
		return (
			<StateComponent<{
				selectedColor: Colors;
				colors: { name: Colors; value: string }[];
			}>
				defaultState={{
					selectedColor: "background",
					colors: [
						{ name: "background", value: background.main },
						{ name: "primary", value: primary.main },
						{ name: "secondary", value: secondary.main },
						{ name: "error", value: error.main },
						{ name: "success", value: success.main },
						{ name: "warning", value: warning.main },
					],
				}}
			>
				{(state, setState) => {
					const saveToTheme = () => {
						const getColor = (color: Colors) => {
							return (
								state.colors.find((currentColor) => currentColor.name === color)
									?.value || Themes.transparent[color].main
							);
						};
						this.setState((fullState) => {
							fullState.settings.desktop.customTheme = {
								type: "custom",
								name: "custom",
								shadowColor: "#000",
								background: makeColor(getColor("background")),
								primary: makeColor(getColor("primary")),
								secondary: makeColor(getColor("secondary")),
								success: makeColor(getColor("success")),
								error: makeColor(getColor("error")),
								warning: makeColor(getColor("warning")),
								windowBarColor: getColor("background"),
								windowBorderColor: Color(getColor("background")).isDark()
									? "#fff"
									: "#000",
								windowBorder: true,
							};
							this.props.setSettings(fullState.settings);
							return {}; // no need to rerender
						});
					};
					return (
						<>
							<div className={classes.categorySubtitle}>
								Create custom theme
							</div>
							<div className={classes.colorsTable}>
								{state.colors.map((color, index) => (
									<div
										key={index}
										className={classes.color}
										style={{ backgroundColor: color.value }}
										onClick={() => setState({ selectedColor: color.name })}
									/>
								))}
							</div>
							<div className={classes.text}>
								slected color: {state.selectedColor}
							</div>
							<SketchPicker
								onChange={(color) => {
									const originalColor = state.colors.find(
										(color) => color.name === state.selectedColor
									);
									if (originalColor) {
										originalColor.value =
											color.hex +
											Math.round((color.rgb.a || 0) * 255).toString(16);
									}
									setState({ colors: state.colors });
								}}
								color={
									state.colors.find(
										(color) => color.name === state.selectedColor
									)?.value
								}
							></SketchPicker>
							<Button border className={classes.margin} onClick={saveToTheme}>
								Save custom theme
							</Button>
						</>
					);
				}}
			</StateComponent>
		);
	};

	renderNetworkCategory = () => {
		const { classes, setSettings } = this.props;
		const phoneMode = window.matchMedia("(max-width: 700px)").matches;
		return (
			<StateComponent
				defaultState={{
					errorMainPort: "",
					errorStartPort: "",
					errorEndPort: "",
					mainPort: this.state.settings.network.ports.mainPort,
					startPort: this.state.settings.network.ports.startPort,
					endPort: this.state.settings.network.ports.endPort,
				}}
			>
				{(state, setState) => (
					<div className={classes.category}>
						<div className={classes.categoryTopBar}>
							{phoneMode && (
								<Button
									color="secondary"
									onClick={() => this.setState({ selectedCategory: undefined })}
									className={classes.categoryBackButton}
								>
									<Icon name="VscChevronLeft" />
								</Button>
							)}
							<div className={classes.categoryTitle}>Network Settings</div>
						</div>
						<div className={classes.marginBlock}>
							<div className={classes.settingsBlock}>
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>Main Port</div>
									<div className={classes.settingsPropertyValue}>
										<input
											type="number"
											value={state.mainPort || ""}
											onChange={(e) => {
												const value = Number(e.target.value) || 0;
												setState({ mainPort: value });
												if (value >= 1025 && value <= 65534) {
													setState({ errorMainPort: "" });
													this.setState((state) => {
														state.settings.network.ports.mainPort = value;
														setSettings(state.settings);
														return {
															settings: state.settings,
														};
													});
												} else {
													setState({
														errorMainPort:
															"please enter a number between 1025 to 65,534",
													});
												}
											}}
										/>
										<div className={classes.settingsPropertyValueError}>
											{state.errorMainPort}
										</div>
									</div>
								</div>
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>Start Port</div>
									<div className={classes.settingsPropertyValue}>
										<input
											type="number"
											value={state.startPort || ""}
											onChange={(e) => {
												const value = Number(e.target.value) || 0;
												setState({ startPort: value });
												if (value >= 1025 && value <= 65534) {
													setState({ errorStartPort: "" });
													this.setState((state) => {
														state.settings.network.ports.startPort = value;
														setSettings(state.settings);
														return {
															settings: state.settings,
														};
													});
												} else {
													setState({
														errorStartPort:
															"please enter a number between 1025 to 65,534",
													});
												}
											}}
										/>
										<div className={classes.settingsPropertyValueError}>
											{state.errorMainPort}
										</div>
									</div>
								</div>
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>End Port</div>
									<div className={classes.settingsPropertyValue}>
										<input
											type="number"
											value={state.endPort || ""}
											onChange={(e) => {
												const value = Number(e.target.value) || 0;
												setState({ endPort: value });
												if (value >= 1025 && value <= 65534) {
													setState({ errorEndPort: "" });
													this.setState((state) => {
														state.settings.network.ports.endPort = value;
														setSettings(state.settings);
														return {
															settings: state.settings,
														};
													});
												} else {
													setState({
														errorEndPort:
															"please enter a number between 1025 to 65,534",
													});
												}
											}}
										/>
										<div className={classes.settingsPropertyValueError}>
											{state.errorMainPort}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</StateComponent>
		);
	};

	renderSystemInfoCategory = () => {
		const { classes, systemInfo } = this.props;
		const phoneMode = window.matchMedia("(max-width: 700px)").matches;

		return (
			<div className={classes.category}>
				<div className={classes.categoryTopBar}>
					{phoneMode && (
						<Button
							color="secondary"
							onClick={() => this.setState({ selectedCategory: undefined })}
							className={classes.categoryBackButton}
						>
							<Icon name="VscChevronLeft" />
						</Button>
					)}
					<div className={classes.categoryTitle}>System Information</div>
				</div>
				{systemInfo?.os && (
					<div className={classes.marginBlock}>
						<div className={classes.categorySubtitle}>OS</div>
						<div className={classes.settingsBlock}>
							{systemInfo.os.hostname && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										computer hostname
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.os.hostname}
									</div>
								</div>
							)}
							{systemInfo.os.platform && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>running os</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.os.platform}
									</div>
								</div>
							)}
							{systemInfo.os.kernel && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										running kernel
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.os.kernel}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
				{systemInfo?.cpu && (
					<div className={classes.marginBlock}>
						<div className={classes.categorySubtitle}>CPU</div>
						<div className={classes.settingsBlock}>
							{systemInfo.cpu?.brandName && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>name</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.cpu.brandName}
									</div>
								</div>
							)}
							{systemInfo.cpu?.manufacturer && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										manufacturer name
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.cpu.manufacturer}
									</div>
								</div>
							)}
							{systemInfo.cpu?.cores && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										number of cores
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.cpu.cores}
									</div>
								</div>
							)}
							{systemInfo.cpu?.physicalCores && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										number of physical cores
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.cpu.physicalCores}
									</div>
								</div>
							)}
							{systemInfo.cpu?.speed && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										prcessor speed
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.cpu.speed} GHz
									</div>
								</div>
							)}
							{systemInfo.cpu?.speedMax && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										prcessor maximum speed
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.cpu.speedMax} GHz
									</div>
								</div>
							)}
							{systemInfo.cpu?.speedMin && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										prcessor minimum speed
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.cpu.speedMin} GHz
									</div>
								</div>
							)}
						</div>
					</div>
				)}
				{systemInfo?.ram && (
					<div className={classes.marginBlock}>
						<div className={classes.categorySubtitle}>Memory</div>
						<div className={classes.settingsBlock}>
							{systemInfo.ram.total && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										total memory amout
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.ram.total}
									</div>
								</div>
							)}
							{systemInfo.ram.free && (
								<div className={classes.settingsProperty}>
									<div className={classes.settingsPropertyName}>
										free memory amout
									</div>
									<div className={classes.settingsPropertyValue}>
										{systemInfo.ram.free}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
				{systemInfo?.disks &&
					systemInfo.disks.map(
						(disk, index) =>
							disk && (
								<div className={classes.marginBlock} key={index}>
									<div className={classes.categorySubtitle}>
										Disk {index + 1}
									</div>
									<div className={classes.settingsBlock}>
										<div className={classes.settingsProperty}>
											<div className={classes.settingsPropertyName}>
												disk name
											</div>
											<div className={classes.settingsPropertyValue}>
												{disk.name}
											</div>
										</div>
										<div className={classes.settingsProperty}>
											<div className={classes.settingsPropertyName}>
												disk vendor
											</div>
											<div className={classes.settingsPropertyValue}>
												{disk.vendor}
											</div>
										</div>
										<div className={classes.settingsProperty}>
											<div className={classes.settingsPropertyName}>
												disk size
											</div>
											<div className={classes.settingsPropertyValue}>
												{disk.total}
											</div>
										</div>
									</div>
								</div>
							)
					)}
			</div>
		);
	};

	render() {
		const { classes } = this.props;
		const { selectedCategory } = this.state;
		const phoneMode = window.matchMedia("(max-width: 700px)").matches;
		return (
			<div className={classes.root}>
				{(!phoneMode || !selectedCategory) && (
					<div className={classes.categorySelection}>
						<div
							className={`${classes.selectCategoryButton} ${
								selectedCategory === "desktop"
									? classes.selectCategoryButtonSelected
									: ""
							}`}
							onClick={() => this.setState({ selectedCategory: "desktop" })}
						>
							<Icon className={classes.categorySelectIcon} name="VscVm" />
							Desktop
						</div>
						<div
							className={`${classes.selectCategoryButton} ${
								selectedCategory === "network"
									? classes.selectCategoryButtonSelected
									: ""
							}`}
							onClick={() => this.setState({ selectedCategory: "network" })}
						>
							<Icon className={classes.categorySelectIcon} name="VscGlobe" />
							Network
						</div>
						<div
							className={`${classes.selectCategoryButton} ${
								selectedCategory === "systemInfo"
									? classes.selectCategoryButtonSelected
									: ""
							}`}
							onClick={() => this.setState({ selectedCategory: "systemInfo" })}
						>
							<Icon className={classes.categorySelectIcon} name="VscInfo" />
							Information
						</div>
					</div>
				)}
				{(selectedCategory === "desktop" ||
					(!phoneMode && !selectedCategory)) &&
					this.renderDesktopCategory()}
				{selectedCategory === "network" && this.renderNetworkCategory()}
				{selectedCategory === "systemInfo" && this.renderSystemInfoCategory()}
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true, name: "Settings" })(
	Settings
);
