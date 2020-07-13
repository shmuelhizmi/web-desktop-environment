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
  TextField,
  List,
  Image,
  ImageFit,
  Icon,
} from "@fluentui/react";
import windowManager, { Window } from "./../state/WindowManager";

export const windowsBarHeight = 55;

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
      bottom: 0,
      left: 45,
      height: 60,
      borderRadius: "15px 15px 0 0",
      fontSize: 40,
      paddingTop: 5,
      borderBottom: "none",
      background: theme.background.transparentDark || theme.background.dark,
      color: theme.background.text,
      backdropFilter: theme.type === "transparent" ? "blur(15px)" : "none",
      border: `solid 1px ${theme.background.main}`,
      "&:hover": {
        color: theme.background.text,
        border: `solid 1px ${theme.background.main}`,
        background: theme.background.transparent || theme.background.main,
      },
      zIndex: 2,
    },
    startMenu: {
      position: "absolute",
      zIndex: 2,
      bottom: 105,
      left: 15,
      width: 500,
      height: 500,
      padding: 5,
      borderRadius: 10,
      background: theme.background.transparent || theme.background.main,
      backdropFilter: "blur(10px)",
      border: `solid 1px ${theme.background.transparent}`,
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
      marginTop: 15,
      boxSizing: "border-box",
      borderBottom: `1px solid ${theme.windowBorderColor}`,
      display: "flex",
      borderRadius: 7,
      color: theme.background.text,
      cursor: "pointer",
      boxShadow: `-1px 2px 20px 2px ${theme.shadowColor}`,
      "&:hover": {
        background: theme.background.transparentDark || theme.background.dark,
      },
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
    startMenuSearch: {
      "& .ms-TextField-fieldGroup": {
        background: "transparent",
        "& input": {
          fontSize: 20,
          fontWeight: 600,
          color: theme.background.text,
        },
        "& input::placeholder": {
          fontSize: 20,
          fontWeight: 600,
          color: theme.background.text,
        },
      },
      color: theme.background.text,
      fontSize: 25,
    },
    windowsBar: {
      position: "absolute",
      bottom: 0,
      left: 180,
      right: 25,
      borderRadius: "15px 15px 0 0",
      height: windowsBarHeight,
      display: "flex",
      backdropFilter: "blur(2px)",
      background: theme.background.transparent || theme.background.main,
      paddingLeft: 10,
      border: `solid 2px ${
        theme.background.transparentDark || theme.background.dark
      }`,
      borderBottom: "none",
      zIndex: 2,
    },
    windowsBarButton: {
      userSelect: "none",
      fontSize: 50,
      padding: 5,
      marginRight: 1,
      cursor: "pointer",
      color: theme.background.text,
      "&:hover": {
        background: theme.background.transparentDark || theme.background.dark,
      },
    },
    windowsBarButtonOpen: {
      borderBottom: `${
        theme.type === "transparent" ? theme.success.main : theme.secondary.main
      } solid 3px`,
    },
    windowsBarButtonCloseMinimized: {
      borderBottom: `${theme.secondary.dark} solid 3px`,
    },
  });

interface DesktopState {
  isStartMenuOpen: boolean;
  startMenuQuery?: string;
  openWindows: Window[];
}

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class Desktop extends ReflowReactComponent<
  DesktopInterface,
  WithStyles<typeof styles>,
  DesktopState
> {
  constructor(props: Desktop["props"]) {
    super(props);
    this.state = {
      isStartMenuOpen: false,
      openWindows: windowManager.windows,
    };
    windowManager.emitter.on("addWindow", this.updateWindow);
    windowManager.emitter.on("closeWindow", this.updateWindow);
    windowManager.emitter.on("maximizeWindow", this.updateWindow);
    windowManager.emitter.on("minimizeWindow", this.updateWindow);
  }

  updateWindow = () =>
    this.setState({ openWindows: [...windowManager.windows] });

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
    const { background, openApps, classes, apps } = this.props;
    const { isStartMenuOpen, startMenuQuery, openWindows } = this.state;
    return (
      <div className={classes.root} style={{ background }}>
        {openApps.map((app, i) => (
          <div
            key={i}
            ref={(div) => div && reflowConnectionManager.connect(app.port, div)}
          />
        ))}
        <Button
          primary
          className={classes.startBotton}
          onClick={() => this.setState({ isStartMenuOpen: !isStartMenuOpen })}
        >
          <Icon iconName="AllApps" />
        </Button>
        <div className={classes.windowsBar}>
          {openWindows.map((openWindow, index) => (
            <div
              key={index}
              className={`${classes.windowsBarButton} ${
                openWindow.state.minimized
                  ? classes.windowsBarButtonCloseMinimized
                  : classes.windowsBarButtonOpen
              }`}
              onClick={() =>
                windowManager.updateState(openWindow.id, {
                  minimized: !openWindow.state.minimized,
                })
              }
            >
              {openWindow.icon.type === "img" ? (
                <img
                  alt={`${openWindow.name} icon`}
                  src={openWindow.icon.icon}
                  width={50}
                  height={50}
                />
              ) : (
                <Icon iconName={openWindow.icon.icon} />
              )}
            </div>
          ))}
        </div>
        {isStartMenuOpen && (
          <div className={classes.startMenu}>
            <div className={classes.startMenuBody}>
              <TextField
                borderless
                className={classes.startMenuSearch}
                placeholder="search app"
                value={startMenuQuery}
                onChange={(_e, startMenuQuery) =>
                  this.setState({ startMenuQuery })
                }
              ></TextField>
              <List
                className={classes.appList}
                items={apps.filter((app) =>
                  startMenuQuery
                    ? app.name.includes(startMenuQuery) ||
                      app.description.includes(startMenuQuery) ||
                      app.flow.includes(startMenuQuery)
                    : true
                )}
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
