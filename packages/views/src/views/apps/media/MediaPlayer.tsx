import React from "react";
import MediaPlayerInterface from "@web-desktop-environment/interfaces/lib/views/apps/media/MediaPlayer";
import {
	withStyles,
	createStyles,
	WithStyles,
	withTheme,
} from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import FileViewer, { makeFileViewerStyles } from "../shared/FileViewer";
import { reactFullstackConnectionManager } from "@root/index";

const styles = (theme: Theme) =>
	createStyles({
		...makeFileViewerStyles(theme),
		videoAreaContanier: {
			width: "100%",
			height: "97%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			overflow: "hidden",
		},
		videoAreaContanierBody: {
			width: "94%",
			height: "95%",
			borderRadius: 10,
			boxShadow: `inset 0px -1px 9px 2px ${theme.shadowColor}`,
			padding: 15,
			background: theme.background.light,
			border: `1px solid ${theme.windowBorderColor}`,
			display: "flex",
			justifyContent: "center",
			overflow: "hidden",
		},
		videoArea: {
			width: "95%",
			maxWidth: "100%",
			maxHeight: "95%",
			border: "none",
			resize: "none",
			background: theme.background.light,
			color:
				theme.type === "transparent"
					? theme.windowBorderColor
					: theme.background.text,
			borderRadius: 10,
			outline: "none",
		},
	});

class MediaPlayer extends FileViewer<
	MediaPlayerInterface,
	WithStyles<typeof styles>
> {
	renderViewer() {
		const { classes, source, port } = this.props;
		return (
			<div className={classes.videoAreaContanier}>
				<div className={classes.videoAreaContanierBody}>
					<video controls className={classes.videoArea}>
						<source
							src={`http://${reactFullstackConnectionManager.host}:${port}/${source}`}
						></source>
					</video>
				</div>
			</div>
		);
	}
}

export default withTheme(withStyles(styles, { withTheme: true })(MediaPlayer));
