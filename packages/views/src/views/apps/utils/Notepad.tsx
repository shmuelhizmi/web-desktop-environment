import React from "react";
import NotepadInterface from "@web-desktop-environment/interfaces/lib/views/apps/utils/Notepad";
import {
	withStyles,
	createStyles,
	WithStyles,
	withTheme,
} from "@material-ui/styles";
import { Theme } from "@root/theme";
import FileViewer, { makeFileViewerStyles } from "../shared/FileViewer";

const styles = (theme: Theme) =>
	createStyles({
		...makeFileViewerStyles(theme),
		textAreaContainer: {
			width: "100%",
			height: "97%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		textAreaContainerBody: {
			width: "94%",
			height: "95%",
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
			background:
				theme.type === "transparent"
					? theme.background.main
					: theme.background.light,
			color: theme.background.text,
			borderRadius: 10,
			outline: "none",
			height: "100%",
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

export default withTheme(withStyles(styles, { withTheme: true })(Notepad));
