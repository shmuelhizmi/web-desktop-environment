import React from "react";
import { Component } from "@react-fullstack/fullstack";
import NotepadInterface from "@web-desktop-environment/interfaces/lib/views/apps/utils/Notepad";
import {
	withStyles,
	createStyles,
	WithStyles,
	withTheme,
} from "@material-ui/styles";
import { Theme } from "@root/theme";
import Button from "@components/button";

const styles = (theme: Theme) =>
	createStyles({
		root: {
			width: "100%",
			height: "100%",
			borderRadius: "0 0 9px 9px",
			background: theme.background.main,
			border: `1px solid ${theme.windowBorderColor}`,
			borderTop: "none",
			boxShadow: `-10px 12px 20px -2px  ${theme.shadowColor}`,
			paddingBottom: 2,
			backdropFilter: theme.type === "transparent" ? "blur(15px)" : "none",
		},
		headlineContainer: {
			width: "100%",
			height: 35,
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
		},
		menuContainer: {
			width: "100%",
			height: 45,
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
		},
		openFileContainer: {
			width: "100%",
			height: "calc(100% - 25px)",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		openFileContainerBody: {
			width: "calc(96% - 15px)",
			height: "93%",
			borderRadius: 5,
			boxShadow: `inset 0px 0 8px 2px ${theme.shadowColor}`,
			padding: "0 15px 15px",
			background: theme.background.light,
			border: `1px solid ${theme.windowBorderColor}`,
		},
		textAreaContanier: {
			width: "100%",
			height: "calc(93% - 25px)",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		textAreaContanierBody: {
			width: "94%",
			height: "calc( 95% - 15px )",
			borderRadius: 10,
			boxShadow: `inset 0px -1px 9px 2px ${theme.shadowColor}`,
			padding: 15,
			background: theme.background.light,
			border: `1px solid ${theme.windowBorderColor}`,
		},
		textArea: {
			width: "100%",
			maxWidth: "100%",
			maxHeight: "100%",
			border: "none",
			resize: "none",
			background: theme.background.light,
			color:
				theme.type === "transparent"
					? theme.windowBorderColor
					: theme.background.text,
			borderRadius: 10,
			outline: "none",
			height: "100%",
		},
		filename: {
			width: "100%",
		},
	});

class Notepad extends Component<
	NotepadInterface,
	{},
	WithStyles<typeof styles>
> {
	constructor(props: Notepad["props"]) {
		super(props);
	}

	render() {
		const {
			classes,
			onSave,
			defaultValue,
			isSelectingFile,
			onReselectFile,
			name,
		} = this.props;
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
						<div className={classes.textAreaContanier}>
							<div className={classes.textAreaContanierBody}>
								<textarea
									defaultValue={defaultValue}
									onChange={(e) => onSave(e.target.value)}
									className={classes.textArea}
								/>
							</div>
						</div>
					</>
				)}
			</div>
		);
	}
}

export default withTheme(withStyles(styles, { withTheme: true })(Notepad));
