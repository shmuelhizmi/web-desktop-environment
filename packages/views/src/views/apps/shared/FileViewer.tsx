import React from "react";
import { Component, View } from "@react-fullstack/fullstack";
import { FileViewerBase } from "@web-desktop-environment/interfaces/lib/shared/fileViewer";
import { createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import Button from "@components/button";

export const makeFileViewerStyles = (theme: Theme) =>
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
			paddingBottom: 2,
			backdropFilter: theme.type === "transparent" ? "blur(15px)" : "none",
			display: "grid",
			gridTemplateRows: "44px calc(100% - 44px)",
		},
		headlineContainer: {
			width: "100%",
			justifyContent: "center",
			display: "flex",
		},
		menuContainer: {
			width: "100%",
			border: `1px solid ${theme.windowBorderColor}`,
			borderRight: "none",
			borderLeft: "none",
			backdropFilter: theme.type === "transparent" ? "blur(10px)" : "none",
			overflow: "hidden",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		headline: {
			fontSize: 25,
			width: "70%",
			borderRadius: 7,
			height: 33,
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
			borderRight: `1px solid ${theme.windowBorderColor} !important`,
			width: 150,
			height: "100%",
			minHeight: "0 !important",
			borderRadius: "5px !important",
			padding: "0 !important",
			minWidth: "110px !important",
			borderTopRightRadius: "0 !important",
			borderBottomRightRadius: "0 !important",
		},
		openFileContainer: {
			width: "100%",
			height: "100%",
			display: "flex",
			justifyContent: "center",
			overflow: "hidden",
		},
		openFileContainerBody: {
			width: "100%",
			height: "100%",
			boxShadow: `inset 0px 0 8px 2px ${theme.shadowColor}`,
			background: theme.background.light,
		},
		filename: {
			width: "100%",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			userSelect: "none",
			overflow: "hidden",
		},
	});

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
