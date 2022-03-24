import ExplorerInterface, {
	File,
} from "@web-desktop-environment/interfaces/lib/views/apps/utils/Explorer";
import { Component } from "@react-fullstack/fullstack";
import React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import Button from "@components/button";
import Icon from "@components/icon";
import TextField from "@components/textField";
import Emitter from "@utils/Emitter";
import { reactFullstackConnectionManager } from "@root/index";
import { transparent } from "@utils/colors";
import { url } from "@utils/url";

const styles = (theme: Theme) =>
	createStyles({
		root: {
			width: "100%",
			height: "100%",
			borderRadius: "0 0 9px 9px",
			background: theme.background.main,
			border: theme.windowBorder
				? `1px solid ${theme.windowBorderColor}`
				: "none",
			borderTop: "none",
			boxShadow: `-10px 12px 20px -2px  ${theme.shadowColor}`,
			backdropFilter: theme.type === "transparent" ? "blur(15px)" : "none",
			display: "grid",
			gridTemplateRows: "44px calc(100% - 44px)",
		},
		actionBarContainer: {
			width: "100%",
			justifyContent: "center",
			display: "flex",
			height: "100%",
		},
		actionBar: {
			borderBottom: `1px solid ${theme.windowBorderColor}`,
			width: "100%",
			height: "100%",
			background: theme.background.dark,
			borderRight: `solid 1px ${theme.windowBorderColor}`,
			backdropFilter: theme.type === "transparent" ? "blur(16px)" : "none",
			borderRadius: "0 0 0 10px",
			alignItems: "center",
			display: "flex",
			flexDirection: "column",
		},
		actionButton: {
			textDecoration: "none",
			width: "100%",
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
			height: 20,
			paddingTop: 10,
			paddingBottom: 10,
			textAlign: "center",
			userSelect: "none",
			animation: "$opacityUp 150ms",
			color: theme.secondary.text,
			fontSize: 18,
			cursor: "pointer",
			borderBottom: `solid 1px ${theme.windowBorderColor}`,
			transition: "background 100ms, transform 100ms",
			...(theme.type === "transparent"
				? {
						backdropFilter: "blur(7px)",
						boxShadow: `-1px 2px 20px 1px ${theme.shadowColor}`,
						background: theme.background.transparent,
						borderBottom: `1px solid ${theme.windowBorderColor}`,
				  }
				: {}),
			"&:hover": {
				...(theme.type === "transparent"
					? {
							backdropFilter: "blur(13px)",
							background: theme.secondary.light,
					  }
					: {
							background: theme.secondary.light,
					  }),
			},
		},
		"@keyframes opacityUp": {
			from: {
				opacity: 0,
			},
			to: {
				opacity: 1,
			},
		},
		locationBarContainer: {
			width: "100%",
			overflow: "auto",
			justifyContent: "center",
			display: "flex",
			border: `1px solid ${theme.windowBorderColor}`,
			borderRight: "none",
			borderLeft: "none",
		},
		locationBar: {
			backdropFilter: theme.type === "transparent" ? "blur(10px)" : "none",
			width: "95%",
			maxHeight: "100%",
			overflowX: "auto",
			display: "flex",
			justifyContent: "center",
			flexDirection: "column",
		},
		breadcrumbFilesContainer: {
			maxHeight: "100%",
			display: "flex",
			justifyContent: "center",
		},
		fileBoxContainer: {
			height: "100%",
			width: "100%",
			display: "grid",
			gridTemplateColumns: "175px calc(100% - 175px)",
		},
		fileBox: {
			boxShadow: `${theme.shadowColor} 0px 7px 20px 1px inset`,
			background: theme.background.transparent || theme.background.main,
			width: "100%",
			height: "100%",
			overflowY: "auto",
			borderBottomRightRadius: 9,
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
		},
		fileContainer: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(80px, 120px))",
			margin: 15,
			justifyContent: "center",
			gridGap: 15,
			gap: "15px",
			gridAutoRows: 100,
		},
		file: {
			borderRadius: 7,
			padding: 2,
			color: theme.secondary.text,
			cursor: "pointer",
			boxShadow: `-1px 2px 10px 1px ${theme.shadowColor}`,
			transition: "background 100ms, transform 200ms",
			"&:hover": {
				transform: "scale(1.1)",
				background: theme.secondary.dark,
				backdropFilter: theme.type === "transparent" ? "blur(12px)" : "none",
			},
			height: 90,
			display: "flex",
			flexDirection: "column-reverse",
		},
		transparent: {
			background: "transparent !important",
		},
		fileActive: {
			background: theme.secondary.transparent || theme.secondary.main,
			"&:hover": {
				backdropFilter: theme.type === "transparent" ? "blur(12px)" : "none",
				background: theme.secondary.transparent || theme.secondary.main,
			},
		},
		fileName: {
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis",
			maxWidth: "100%",
			textAlign: "center",
			userSelect: "none",
		},
		fileIcon: {
			userSelect: "none",
			textAlign: "center",
			maxWidth: 100,
			fontSize: 50,
		},
		fileBreadcrumb: {
			width: "100%",
		},
		breadcrumbButtonItem: {
			minWidth: 20,
			textAlign: "center",
			userSelect: "none",
			color: theme.primary.text,
			fontSize: 25,
			background: theme.primary.transparent,
			border: "solid 1px transparent",
			maxWidth: 380,
			overflow: "hidden",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			transition: "background 100ms",
			"&:hover": {
				background: theme.primary.main,
			},
			cursor: "pointer",
		},
		breadcrumbButtonItemFirst: {
			borderRadius: "8px 0 0 8px",
			paddingLeft: 10,
		},
		breadcrumbButtonItemLast: {
			cursor: "auto",
			borderRadius: "0 8px 8px 0",
			background:
				theme.type === "light"
					? theme.primary.main
					: transparent(theme.primary.main, 0.6),
			"&:hover": {
				background: theme.primary.main,
				backdropFilter: theme.type === "transparent" ? "blur(12px)" : "none",
			},
			paddingRight: 10,
		},
		dialog: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
			height: "100%",
			flexDirection: "column",
		},
		dialogMessage: {
			maxWidth: "80%",
			textAlign: "center",
			color: theme.background.text,
			fontSize: 25,
		},
		dialogButtons: {
			margin: 20,
			width: "50%",
			display: "flex",
			justifyContent: "center",
		},
		"@media (max-width: 700px)": {
			dialogButtons: {
				flexDirection: "column",
				alignItems: "center",
			},
			fileContainer: {
				display: "flex",
				flexDirection: "column",
				margin: 0,
				gap: 0,
			},
			fileBoxContainer: {
				gridTemplateColumns: "145px calc(100% - 145px)",
			},
			file: {
				flexDirection: "row",
				height: 70,
				alignItems: "center",
				justifyContent: "space-between",
				margin: 5,
				boxShadow: "none",
				borderRadius: 0,
				"&:hover": {
					transform: "scale(1)",
				},
			},
		},
		fileContainerMini: {
			gridTemplateColumns: "100%",
		},
		dialogButton: {
			margin: 10,
			width: "100%",
			fontSize: 50,
			height: "fit-content",
			borderRadius: 7,
			background: theme.primary.main,
			"&:hover": {
				background: theme.primary.dark,
				backdropFilter: theme.type === "transparent" ? "blur(12px)" : "none",
			},
		},
		dialogButtonPrimary: {
			background: theme.secondary.main,
			"&:hover": {
				background: theme.secondary.dark,
				backdropFilter: theme.type === "transparent" ? "blur(12px)" : "none",
			},
		},
		dialogInput: {
			margin: 10,
			color: theme.background.text,
			fontSize: 25,
		},
		openButton: {
			margin: 5,
		},
		stickyActionBarContainer: {
			position: "sticky",
			bottom: 0,
			width: "100%",
			borderRadius: "0 0 9px 9px",
			justifyContent: "center",
			display: "flex",
			background: theme.background.dark,
			borderTop: `1px solid ${theme.windowBorderColor}`,
		},
		actionBarNoBorder: {
			borderBottom: "none",
		},
	});

interface Confirm {
	message: string;
	result?: boolean;
}

interface Prompt {
	message: string;
	value: string;
	result?: boolean;
}

interface ExplorerState {
	fileIsOverFile?: number;
	selectedFile?: number;
	dragedFile?: File;
	copyPath?: { fullPath: string; name: string };
	cutPath?: { fullPath: string; name: string };
	confirm?: Confirm;
	prompt?: Prompt;
	downloadUrl?: string;
}

interface ExplorerEvents {
	confirmDone: Confirm;
	promptDone: Prompt;
}

class Explorer extends Component<
	ExplorerInterface,
	ExplorerState,
	WithStyles<typeof styles>
> {
	selectedFile?: File & { fullPath: string };
	constructor(props: Explorer["props"]) {
		super(props);
		this.state = {};
	}

	emitter = new Emitter<ExplorerEvents>();

	confirm = async (message: string) => {
		return await new Promise((resolve, reject) => {
			this.setState(
				{
					confirm: {
						message,
					},
				},
				() => {
					const confirmDone = (confirm: Confirm) => {
						if (confirm.result !== undefined) {
							resolve(confirm.result);
							this.setState({ confirm: undefined });
						} else {
							reject(new Error("confirm does not have a result."));
						}
						this.emitter.off("confirmDone", confirmDone);
					};
					this.emitter.on("confirmDone", confirmDone);
				}
			);
		});
	};

	prompt = async (
		message: string
	): Promise<{ result: boolean; value: string }> => {
		return await new Promise((resolve) => {
			this.setState(
				{
					prompt: {
						message,
						value: "",
					},
				},
				() => {
					const promptFinish = (prompt: Prompt) => {
						if (prompt.result) {
							resolve({ result: prompt.result, value: prompt.value });
						} else {
							resolve({ result: false, value: prompt.value });
						}
						this.setState({ prompt: undefined });
						this.emitter.off("promptDone", promptFinish);
					};
					this.emitter.on("promptDone", promptFinish);
				}
			);
		});
	};

	getBreadcrumbLocations = (maxLength: number) => {
		const {
			currentPath,
			platformPathSeparator,
			onChangeCurrentPath,
		} = this.props;
		let currentLocation = "";
		const pathArray: string[] = [];
		currentPath
			.split(platformPathSeparator)
			.filter((path) => path)
			.forEach((path) => pathArray.push(`${path}${platformPathSeparator}`));
		pathArray.unshift(platformPathSeparator);
		const result = pathArray.map((path, i) => {
			currentLocation += path;
			const pathPartPath = currentLocation;
			return {
				path,
				isFirst: i === 0,
				isLast: i === pathArray.length - 1,
				onClick: () => {
					onChangeCurrentPath(pathPartPath);
					this.setState({ selectedFile: undefined });
					this.selectedFile = undefined;
				},
				onDrop: () => this.onDropPath(pathPartPath),
			};
		});
		while (result.length > maxLength) {
			result.shift();
			result[0].isFirst = true;
		}
		return result;
	};

	private onDrop = async (target: File) => {
		const { currentPath, platformPathSeparator, onMove } = this.props;
		this.setState({ dragedFile: undefined });
		if (
			this.state.dragedFile &&
			this.state.dragedFile !== target &&
			target.isFolder
		) {
			const newPath = `${currentPath}${platformPathSeparator}${target.name}${platformPathSeparator}${this.state.dragedFile.name}`;
			const originalPath = `${currentPath}${platformPathSeparator}${this.state.dragedFile.name}`;
			this.setState({
				fileIsOverFile: undefined,
				selectedFile: undefined,
			});
			if (
				await this.confirm(
					` do you want to move ${this.state.dragedFile.name} to ${newPath}`
				)
			) {
				onMove({
					newPath,
					originalPath,
				});
			}
		}
	};

	private onDropPath = async (path: string) => {
		const { currentPath, platformPathSeparator, onMove } = this.props;
		if (this.state.dragedFile) {
			const newPath = `${path}${platformPathSeparator}${this.state.dragedFile.name}`;
			const originalPath = `${currentPath}${platformPathSeparator}${this.state.dragedFile.name}`;
			this.setState({
				fileIsOverFile: undefined,
				selectedFile: undefined,
			});
			if (
				await this.confirm(
					` do you want to move ${this.state.dragedFile.name} to ${newPath}`
				)
			) {
				onMove({
					newPath,
					originalPath,
				});
			}
		}
	};

	private onFileDragOver = (file: File, index: number) => {
		if (
			file.isFolder &&
			this.state.dragedFile?.name !== file.name &&
			this.state.fileIsOverFile !== index
		) {
			this.setState({ fileIsOverFile: index });
		}
	};

	deleteSelected = async () => {
		const { currentPath, platformPathSeparator, onDelete } = this.props;
		if (
			this.selectedFile &&
			(await this.confirm(
				`are you sure you want to delete ${this.selectedFile.name}`
			))
		) {
			onDelete(
				`${currentPath}${platformPathSeparator}${this.selectedFile.name}`
			);
			this.setState({ selectedFile: undefined });
			this.selectedFile = undefined;
		}
	};

	createFolder = async () => {
		const promptCreate = await this.prompt("please enter folder name:");
		const { currentPath, platformPathSeparator, onCreateFolder } = this.props;
		if (promptCreate.value) {
			onCreateFolder(
				`${currentPath}${platformPathSeparator}${promptCreate.value}`
			);
		}
	};

	createFile = async () => {
		const promptCreate = await this.prompt("please enter file name:");
		const { currentPath, platformPathSeparator, onCreateFile } = this.props;
		if (promptCreate.value) {
			onCreateFile(
				`${currentPath}${platformPathSeparator}${promptCreate.value}`
			);
		}
	};

	private Past = () => {
		const { cutPath, copyPath } = this.state;
		const { platformPathSeparator, currentPath, onMove, onCopy } = this.props;
		if (cutPath || copyPath) {
			if (this.selectedFile?.isFolder) {
				if (cutPath && cutPath.fullPath !== this.selectedFile?.fullPath) {
					onMove({
						newPath: `${this.selectedFile.fullPath}${platformPathSeparator}${cutPath.name}`,
						originalPath: cutPath.fullPath,
					});
					this.setState({ copyPath: undefined });
				}
				if (copyPath && copyPath.fullPath !== this.selectedFile?.fullPath) {
					onCopy({
						newPath: `${this.selectedFile.fullPath}${platformPathSeparator}${copyPath.name}`,
						originalPath: copyPath.fullPath,
					});
				}
			} else {
				if (cutPath) {
					onMove({
						newPath: `${currentPath}${platformPathSeparator}${cutPath.name}`,
						originalPath: cutPath.fullPath,
					});
				}
				if (copyPath) {
					onCopy({
						newPath: `${currentPath}${platformPathSeparator}${copyPath.name}`,
						originalPath: copyPath.fullPath,
					});
				}
			}
		}
	};

	openSelected = () => {
		const { currentPath, platformPathSeparator, onOpen } = this.props;
		if (this.selectedFile) {
			onOpen(`${currentPath}${platformPathSeparator}${this.selectedFile.name}`);
		}
	};

	render() {
		const {
			classes,
			files,
			currentPath,
			platformPathSeparator,
			onRequestDownloadLink,
			onChangeCurrentPath,
			onSelect,
			type,
		} = this.props;
		const {
			fileIsOverFile,
			selectedFile,
			copyPath,
			cutPath,
			downloadUrl,
			prompt,
			confirm,
		} = this.state;
		return (
			<div className={classes.root}>
				<div className={classes.locationBarContainer}>
					<div className={classes.locationBar}>
						<div className={classes.breadcrumbFilesContainer}>
							{this.getBreadcrumbLocations(6).map((breadcrumbItem, index) => (
								<div
									className={`${classes.breadcrumbButtonItem} ${
										breadcrumbItem.isFirst
											? classes.breadcrumbButtonItemFirst
											: ""
									} ${
										breadcrumbItem.isLast
											? classes.breadcrumbButtonItemLast
											: ""
									}`}
									key={index}
									onDrop={breadcrumbItem.onDrop}
									onDragOverCapture={(e) => e.preventDefault()}
									onClick={breadcrumbItem.onClick}
								>
									{breadcrumbItem.path}
								</div>
							))}
						</div>
					</div>
				</div>
				<div
					className={`${classes.fileBoxContainer} ${
						type === "explore" && !prompt && !confirm
							? ""
							: classes.fileContainerMini
					}`}
				>
					{type === "explore" && !prompt && !confirm && (
						<div className={classes.actionBarContainer}>
							<div className={classes.actionBar}>
								<div className={classes.actionButton} onClick={this.createFile}>
									new File
								</div>
								<div
									className={classes.actionButton}
									onClick={this.createFolder}
								>
									new Folder
								</div>
								{selectedFile !== undefined && (
									<div
										className={classes.actionButton}
										onClick={this.deleteSelected}
									>
										Delete
									</div>
								)}
								{selectedFile !== undefined && !this.selectedFile?.isFolder && (
									<div
										className={classes.actionButton}
										onClick={this.openSelected}
									>
										Open
									</div>
								)}
								{selectedFile !== undefined && (
									<div
										className={classes.actionButton}
										onClick={() =>
											this.selectedFile &&
											this.setState({
												copyPath: {
													fullPath: this.selectedFile.fullPath,
													name: this.selectedFile.name,
												},
												cutPath: undefined,
											})
										}
									>
										Copy
									</div>
								)}
								{selectedFile !== undefined && (
									<div
										className={classes.actionButton}
										onClick={() =>
											this.selectedFile &&
											this.setState({
												cutPath: {
													fullPath: this.selectedFile.fullPath,
													name: this.selectedFile.name,
												},
												copyPath: undefined,
											})
										}
									>
										Cut
									</div>
								)}
								{(cutPath || copyPath) && (
									<div className={classes.actionButton} onClick={this.Past}>
										Past
									</div>
								)}
								{downloadUrl && (
									<a
										className={classes.actionButton}
										target="_blank"
										rel="noopener noreferrer"
										href={downloadUrl}
										download
									>
										{selectedFile === undefined || downloadUrl
											? "Download"
											: "Loading..."}
									</a>
								)}
							</div>
						</div>
					)}
					<div className={classes.fileBox}>
						{prompt && (
							<div className={classes.dialog}>
								<div className={classes.dialogMessage}>{prompt.message}</div>
								<TextField
									value={prompt.value}
									onChange={(newValue) =>
										prompt &&
										this.setState({
											prompt: { ...prompt, value: newValue || "" },
										})
									}
									className={classes.dialogInput}
								/>
								<div className={classes.dialogButtons}>
									<Button
										color="secondary"
										className={`${classes.dialogButton} ${classes.dialogButtonPrimary}`}
										onClick={() =>
											prompt &&
											this.setState(
												{
													prompt: { ...prompt, result: true },
												},
												() =>
													this.emitter.call(
														"promptDone",
														this.state.prompt as Prompt
													)
											)
										}
									>
										OK
									</Button>
									<Button
										className={classes.dialogButton}
										onClick={() =>
											prompt &&
											this.setState(
												{
													prompt: { ...prompt, result: false },
												},
												() =>
													this.emitter.call(
														"promptDone",
														this.state.prompt as Prompt
													)
											)
										}
									>
										Cancel
									</Button>
								</div>
							</div>
						)}
						{confirm && (
							<div className={classes.dialog}>
								<div className={classes.dialogMessage}>{confirm.message}</div>
								<div className={classes.dialogButtons}>
									<Button
										className={classes.dialogButton}
										onClick={() =>
											this.setState(
												(state) =>
													state.confirm?.message
														? {
																confirm: {
																	message: state.confirm.message,
																	result: false,
																},
														  }
														: {},
												() =>
													this.emitter.call(
														"confirmDone",
														this.state.confirm as Confirm
													)
											)
										}
									>
										Cancel
									</Button>
									<Button
										color="secondary"
										className={`${classes.dialogButton} ${classes.dialogButtonPrimary}`}
										onClick={() =>
											this.setState(
												(state) =>
													state.confirm?.message
														? {
																confirm: {
																	message: state.confirm.message,
																	result: true,
																},
														  }
														: {},
												() =>
													this.emitter.call(
														"confirmDone",
														this.state.confirm as Confirm
													)
											)
										}
									>
										OK
									</Button>
								</div>
							</div>
						)}
						{!prompt && !confirm && (
							<>
								<div className={classes.fileContainer}>
									{files.map((file, index) => (
										<div
											className={`${classes.file} ${
												fileIsOverFile === index || selectedFile === index
													? classes.fileActive
													: ""
											} ${
												this.state.dragedFile === file
													? classes.transparent
													: ""
											}`}
											key={index}
											draggable
											onDrag={() => {
												this.setState({ dragedFile: file });
											}}
											onDrop={() => this.onDrop(file)}
											onDragOverCapture={(e) => {
												this.onFileDragOver(file, index);
												e.preventDefault();
											}}
											onDragLeave={() => {
												if (fileIsOverFile === index) {
													this.setState({ fileIsOverFile: undefined });
												}
											}}
											onClick={() => {
												if (selectedFile !== index) {
													this.selectedFile = {
														...file,
														fullPath: `${currentPath}${platformPathSeparator}${file.name}`,
													};
													this.setState(
														{ selectedFile: index, downloadUrl: undefined },
														() => {
															if (
																this.selectedFile &&
																!this.selectedFile.isFolder
															) {
																onRequestDownloadLink(
																	this.selectedFile.fullPath
																).then(({ path, downloadServerDomain }) => {
																	this.setState({
																		downloadUrl: url({
																			domain: downloadServerDomain,
																			path,
																		}),
																	});
																});
															}
														}
													);
												} else {
													this.setState({
														selectedFile: undefined,
														downloadUrl: undefined,
													});
													this.selectedFile = undefined;
												}
											}}
											onDoubleClick={() => {
												if (file.isFolder) {
													onChangeCurrentPath(
														`${currentPath}${platformPathSeparator}${file.name}${platformPathSeparator}`
													);
												} else if (type === "select-file" && onSelect) {
													onSelect(
														`${currentPath}${platformPathSeparator}${file.name}`
													);
												}
											}}
										>
											<div className={classes.fileName}>{file.name}</div>
											{file.isFolder ? (
												<Icon
													className={classes.fileIcon}
													name={
														fileIsOverFile === index
															? "FcOpenedFolder"
															: "FcFolder"
													}
												/>
											) : (
												<Icon className={classes.fileIcon} name="FcDocument" />
											)}
										</div>
									))}
								</div>
								{type !== "explore" && (
									<div className={classes.stickyActionBarContainer}>
										<div
											className={`${classes.actionBar} ${classes.actionBarNoBorder}`}
										>
											<Button
												className={classes.openButton}
												variant="light"
												color="secondary"
												onClick={() => {
													if (
														onSelect &&
														this.selectedFile &&
														((type === "select-file" &&
															!this.selectedFile.isFolder) ||
															(type === "select-folder" &&
																this.selectedFile.isFolder))
													) {
														onSelect(this.selectedFile.fullPath);
													}
												}}
											>
												Open
											</Button>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true, name: "Explorer" })(
	Explorer
);
