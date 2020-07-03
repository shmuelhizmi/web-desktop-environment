import DesktopInterface from "web-desktop-environment-interfaces/lib/views/Desktop";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../theme";

const styles = (theme: Theme) => createStyles({ 
    root: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
});


// using ReflowReactComponent in this case provides the event() and done() callbacks.
class Desktop extends ReflowReactComponent<DesktopInterface, WithStyles<typeof styles>> {
	render() {
		const { background, event, children, classes } = this.props;
		return (
			<div className={classes.root} style={{ background }}>
				
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Desktop);
