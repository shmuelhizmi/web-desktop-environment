import DesktopInterface from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../theme";
import { reflowConnectionManager } from "..";
import { Button } from "@fluentui/react";

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
		const { background, event, openApps, classes } = this.props;
		return (
			<div className={classes.root} style={{ background }}>
				{
                    openApps.map((app, i) => <div key={i} ref={(div) => div && reflowConnectionManager.connect(app.port, div) } />)
                }
                <Button onClick={() => event("launchApp", { flow: "terminal", params: {} })}>create terminal window</Button>
			</div>
		);
	}
}

export default withStyles(styles)(Desktop);
