import WindowInterface from "@web-desktop-environment/interfaces/lib/views/Window";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../theme";
import ReactDOM from "react-dom";
import reactClickOutside from "react-click-outside";
import Dragable from "react-draggable";
import { Icon } from "@fluentui/react";
import windowManager from "./../state/WindowManager";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      boxShadow: "-10px 12px 20px -2px #0007",
    },
    bar: {
      background: "rgba(191, 191, 191, 0.4)",
      backdropFilter: "blur(15px)",
      borderRadius: "7px 7px 0 0",
      cursor: "move",
      display: "flex",
    },
    body: {
      borderRadius: "0 0 3px 3px",
    },
    barButtonsContainer: {
      position: "relative",
      top: 5,
      left: 5,
      width: 60,
      height: 20,
      display: "flex",
      justifyContent: "space-between",
      zIndex: 2,
    },
    barButton: {
      width: 15,
      height: 15,
      borderRadius: "50%",
      border: "1px solid #0004",
    },
    barButtonExit: {
      cursor: "pointer",
      background: "#f7252c88",
      "&:hover": {
        background: "#f00",
      },
    },
    barButtonCollaps: {
      cursor: "pointer",
      background: "#21c62f88",
      "&:hover": {
        background: "#21e62f",
      },
    },
    barTitle: {
      position: "relative",
      top: 5,
      left: -30,
      width: "100%",
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      userSelect: "none",
      color: "#fff",
    },
    barTitleIcon: {
      position: "relative",
      top: 3,
    },
  });

interface WindowState {
  size: { height: number; width: number };
  zIndex: number;
  canDrag: boolean;
  collaps: boolean;
  position: { x: number; y: number };
}

const defualtWindowSize = { height: 600, width: 700 };

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class Window extends ReflowReactComponent<
  WindowInterface,
  WithStyles<typeof styles>,
  WindowState
> {
  domContainer: Element;
  id: number;
  constructor(props: Window["props"]) {
    super(props);
    this.state = {
      size: {
        height: props.window.height || defualtWindowSize.height,
        width: props.window.width || defualtWindowSize.width,
      },
      zIndex: 2,
      canDrag: false,
      collaps: props.window.minimized || false,
      position: props.window.position || {
        x: window.screen.width / 3,
        y: window.screen.height / 3,
      },
    };
    this.domContainer = document.createElement("div");
    document.getElementById("app")?.appendChild(this.domContainer);
    this.id = windowManager.addWindow(props.name, props.icon, {
      minimized: props.window.minimized || false,
    });
    windowManager.emitter.on(
      "minimizeWindow",
      ({ id }) => id === this.id && this.setState({ collaps: true })
    );
    windowManager.emitter.on(
      "maximizeWindow",
      ({ id }) => id === this.id && this.setState({ collaps: false, zIndex: 5 })
    );
  }

  static windowBarHeight = 25;

  handleClickOutside() {
    this.setState({ zIndex: 2 });
  }

  render() {
    const { size, canDrag, zIndex, collaps } = this.state;
    const {
      children,
      classes,
      done,
      title,
      icon,
      event,
      window: { maxHeight, maxWidth, minHeight, minWidth },
    } = this.props;
    return ReactDOM.createPortal(
      <Dragable
        disabled={!canDrag}
        defaultPosition={this.state.position}
        onDrag={(e, position) => {
          this.setState({ zIndex: 5 });
          if (
            position.y < 0 ||
            position.y > window.screen.height - size.height ||
            position.x < 0 ||
            position.x > window.screen.width - size.width
          ) {
            return false;
          }
        }}
        onStop={(e, fullPosition) => {
          const position = { x: fullPosition.x, y: fullPosition.y };
          if (position.y < 0) {
            position.y = 0;
          }
          if (position.y > window.screen.height - size.height) {
            position.y = window.screen.height - size.height;
          }
          if (position.x < 0) {
            position.x = 0;
          }
          if (position.x > window.screen.width - size.width) {
            position.x = window.screen.width - size.width;
          }
          this.setState({ position });
          event("setWindowState", {
            position,
            minimized: this.state.collaps,
          });
        }}
      >
        <div
          className={classes.root}
          onClick={() => this.setState({ zIndex: 5 })}
          style={{
            width: size.width,
            zIndex,
          }}
        >
          <div
            style={{ height: Window.windowBarHeight, width: size.width }}
            onMouseEnter={() => this.setState({ canDrag: true })}
            onMouseLeave={() => this.setState({ canDrag: false })}
            className={classes.bar}
          >
            <div className={classes.barButtonsContainer}>
              <div
                className={`${classes.barButton} ${classes.barButtonExit}`}
                onClick={() => {
                  done({});
                  windowManager.closeWindow(this.id);
                }}
              />
              <div
                className={classes.barButton}
                style={{ background: "#af9941" }}
              />
              <div
                onClick={() => {
                  windowManager.updateState(this.id, {
                    minimized: !this.state.collaps,
                  });
                }}
                className={`${classes.barButton} ${classes.barButtonCollaps}`}
              />
            </div>
            <div className={classes.barTitle}>
              {title} -{" "}
              {icon.type === "fluentui" ? (
                <Icon className={classes.barTitleIcon} iconName={icon.icon} />
              ) : (
                <img className={classes.barTitleIcon} width={14} height={14} />
              )}
            </div>
          </div>
          {!collaps && (
            <div
              className={classes.body}
              style={{
                maxHeight,
                maxWidth,
                minHeight,
                minWidth,
                ...size,
              }}
            >
              {children}
            </div>
          )}
        </div>
      </Dragable>,
      this.domContainer
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  reactClickOutside(Window)
);
