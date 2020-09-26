import React from "react";
import { Component, View } from "@react-fullstack/fullstack";
import { FileViewerBase } from "@web-desktop-environment/interfaces/lib/shared/fileViewer";
import { WithStyles } from "@material-ui/styles";
import { Theme } from "@root/theme";
import Button from "@components/button";

export const makeFileViewerStyles = (theme: Theme) =>
	({
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
			paddingBottom: 2,
			backdropFilter: theme.type === "transparent" ? "blur(15px)" : "none",
			display: "grid",
			gridTemplateRows: "65px 1fr",
		},
		headlineContainer: {
			width: "100%",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
		},
		menuContainer: {
			width: "100%",
			overflow: "hidden",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		headline: {
			fontSize: 25,
			width: "70%",
			borderRadius: 7,
			margin: 5,
			userSelect: "none",
			color: theme.background.darkText || theme.background.text,
			textAlign: "center",
			background: theme.background.light,
			border: `1px solid ${theme.windowBorderColor}`,
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			position: "sticky",
		},
		backButton: {
			position: "relative",
			right: 0,
			width: 150,
			minWidth: "110px !important",
		},
		openFileContainer: {
			width: "100%",
			height: "97%",
			display: "flex",
			justifyContent: "center",
			overflow: "hidden",
		},
		openFileContainerBody: {
			width: "calc(96% - 15px)",
			height: "95%",
			borderRadius: 5,
			boxShadow: `inset 0px 0 8px 2px ${theme.shadowColor}`,
			padding: "0 15px 15px",
			background: theme.background.light,
			border: `1px solid ${theme.windowBorderColor}`,
		},
		filename: {
			width: "100%",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			userSelect: "none",
			overflow: "hidden",
		},
	} as const);

abstract class FileViewer<
	ViewType extends View<FileViewerBase>,
	Styles extends WithStyles<typeof makeFileViewerStyles>
> extends Component<ViewType, {}, Styles> {
	abstract renderViewer(): JSX.Element;
	render() {
		const { classes, isSelectingFile, onReselectFile, name } = this.props;
		return (
			<div className={classes.root}>
				{isSelectingFile ? (
					<>
						<div className={classes.headlineContainer}>
							<div className={classes.headline}>
								<div className={classes.filename}>
									Please select file to edit
								</div>
							</div>
						</div>
						<div className={classes.openFileContainer}>
							<div className={classes.openFileContainerBody}>
								{this.props.children}
							</div>
						</div>
					</>
				) : (
					<>
						<div className={classes.menuContainer}>
							<div className={classes.headline}>
								<Button
									className={classes.backButton}
									color="secondary"
									onClick={() => onReselectFile()}
								>
									{"<- back"}
								</Button>
								<div className={classes.filename}>Editing {name}</div>
							</div>
						</div>
						{this.renderViewer()}
					</>
				)}
			</div>
		);
	}
}

export default FileViewer;
