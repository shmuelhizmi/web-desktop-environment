import React from "react";
import NotepadInterface from "@web-desktop-environment/interfaces/lib/views/apps/utils/Notepad";
import { withStyles, createStyles, WithStyles, withTheme } from "@mui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import FileViewer, { makeFileViewerStyles } from "../shared/FileViewer";

const styles = (theme: Theme) =>
	createStyles({
		...makeFileViewerStyles(theme),
		textAreaContainer: {
			width: "100%",
			height: "100%",
			justifyContent: "center",
			position: "relative",
			top: 1,
			alignItems: "center",
			display: "flex",
		},
		textAreaContainerBody: {
			width: "100%",
			height: "100%",
			background: theme.background.light,
			paddingBottom: 2,
			borderRadius: "0 0 9px 9px",
		},
		textArea: {
			width: "100%",
			border: "none",
			boxShadow: `${theme.shadowColor} 0px 7px 20px 1px inset`,
			resize: "none",
			borderRadius: "0 0 9px 9px",
			padding: 0,
			background:
				theme.type === "transparent"
					? theme.background.main
					: theme.background.light,
			color: theme.background.text,
			outline: "none",
			height: "calc(100% + 2px)",
		},
		filename: {
			width: "100%",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			userSelect: "none",
			overflow: "hidden",
		},
	});

class Notepad extends FileViewer<NotepadInterface, WithStyles<typeof styles>> {
	constructor(props: Notepad["props"]) {
		super(props);
	}

	renderViewer() {
		const { classes, onSave, defaultValue } = this.props;
		return (
			<div className={classes.textAreaContainer}>
				<div className={classes.textAreaContainerBody}>
					<textarea
						defaultValue={defaultValue}
						onChange={(e) => onSave(e.target.value)}
						className={classes.textArea}
					/>
				</div>
			</div>
		);
	}
}

export default withTheme(
	withStyles(styles, { withTheme: true, name: "Notepad" })(Notepad)
);
