import DesktopInterface, {
  App,
} from "@web-desktop-environment/interfaces/lib/views/Desktop";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../theme";
import { reflowConnectionManager } from "..";
import {
  Button,
  CompoundButton,
  TextField,
  List,
  Image,
  ImageFit,
  Icon,
} from "@fluentui/react";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    },
    startBotton: {
      position: "absolute",
      bottom: 15,
      left: 15,
      borderRadius: 5,
    },
    startMenu: {
      position: "absolute",
      zIndex: 3,
      bottom: 105,
      left: 15,
      width: 500,
      height: 500,
      padding: 5,
      borderRadius: 10,
      background: "#0003",
      backdropFilter: "blur(10px)",
      border: "solid 1px #fff3",
      boxShadow: "-5px 6px 10px -1px #0007",
    },
    startMenuBody: {
      width: "100%",
      height: "100%",
      marginTop: 20,
    },
    appList: {
      margin: 7,
    },
    appCell: {
      minHeight: 54,
      padding: 10,
      boxSizing: "border-box",
      borderBottom: "1px solid #333",
      display: "flex",
      borderRadius: 7,
      color: "#fff",
      fontFamily: "cursive",
      cursor: "pointer",
      boxShadow: "-1px 2px 20px 1px #0007",
      "&:hover": { background: "#1112" },
    },
    appIcon: {
      flexShrink: 0,
      width: 50,
      height: 50,
      fontSize: 50,
    },
    appContent: {
      textAlign: "left",
      marginLeft: 10,
      overflow: "hidden",
      flexGrow: 1,
    },
    appName: {
      fontSize: "x-large",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  });

interface DesktopState {
  isStartMenuOpen: boolean;
  startMenuQuery?: string;
}

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class Desktop extends ReflowReactComponent<
  DesktopInterface,
  WithStyles<typeof styles>,
  DesktopState
> {
  state: DesktopState = {
    isStartMenuOpen: false,
  };
  renderAppListCell = (app?: App) => {
    const { classes, event } = this.props;
    return (
      <div
        className={classes.appCell}
        onClick={() =>
          app && event("launchApp", { flow: app.flow, params: {} })
        }
      >
        {app && (
          <>
            {app.icon.type === "img" ? (
              <Image
                className={classes.appIcon}
                src={app.icon.icon}
                imageFit={ImageFit.cover}
              />
            ) : (
              <Icon className={classes.appIcon} iconName={app.icon.icon}></Icon>
            )}
            <div className={classes.appContent}>
              <div className={classes.appName}>{app.name}</div>
              <div>{app.description}</div>
            </div>
          </>
        )}
      </div>
    );
  };

  render() {
    const { background, event, openApps, classes, apps } = this.props;
    const { isStartMenuOpen, startMenuQuery } = this.state;
    return (
      <div className={classes.root} style={{ background }}>
        {openApps.map((app, i) => (
          <div
            key={i}
            ref={(div) => div && reflowConnectionManager.connect(app.port, div)}
          />
        ))}
        <CompoundButton
          primary
          secondaryText="open start menu"
          className={classes.startBotton}
          onClick={() => this.setState({ isStartMenuOpen: !isStartMenuOpen })}
        >
          Start
        </CompoundButton>
        {isStartMenuOpen && (
          <div className={classes.startMenu}>
            <div className={classes.startMenuBody}>
              <TextField
                placeholder="search app"
                value={startMenuQuery}
                onChange={(_e, startMenuQuery) =>
                  this.setState({ startMenuQuery })
                }
              ></TextField>
              <List
                className={classes.appList}
                items={apps}
                onRenderCell={this.renderAppListCell}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Desktop);
