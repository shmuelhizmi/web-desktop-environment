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
      width: 40,
      height: 20,
      display: "flex",
      justifyContent: "space-between",
    },
    barButton: {
      width: 15,
      height: 15,
      borderRadius: "50%",
      zIndex: 2,
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
      canDrag: false,
      collaps: props.window.minimized || false,
      position: props.window.position || {
        x: window.screen.availWidth / 3,
        y: window.screen.availHeight / 3,
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

    windowManager.emitter.on("maximizeWindow", ({ id }) => {
      if (id === this.id) {
        this.setState({ collaps: false });
      }
      this.moveToTop();
    });
  }

  moveToTop = () => { // remove and readd window -> move to top in html tree
   const parent = document.getElementById("app");
   if (parent) {
	   if (parent.childNodes[parent.childNodes.length -1] !== this.domContainer) {
		   parent.removeChild(this.domContainer);
		   parent.appendChild(this.domContainer);
	   }
   }
  };

  static windowBarHeight = 25;

  render() {
    const { size, canDrag, collaps } = this.state;
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
      <div>
        <Dragable
          disabled={!canDrag}
          defaultPosition={this.state.position}
          onDrag={(e, position) => {
            this.moveToTop();
            if (
              position.y < 0 ||
              position.y > window.innerHeight - size.height ||
              position.x < 0 - size.width * 0.5 ||
              position.x > window.innerWidth - (size.width * 0.5)
            ) {
              return false;
            }
          }}
          onStop={(e, fullPosition) => {
            const position = { x: fullPosition.x, y: fullPosition.y };
            if (position.y < 0) {
              position.y = 0;
            }
            if (position.y > window.innerHeight - size.height) {
              position.y = window.innerWidth - size.height;
            }
            if (position.x < 0) {
              position.x = 0;
            }
            if (position.x > window.innerHeight - size.width) {
              position.x = window.innerWidth - size.width;
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
            onClick={() => this.moveToTop()}
            style={{
              width: size.width,
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
                  <img
                    className={classes.barTitleIcon}
                    alt="windows icon"
                    width={14}
                    height={14}
                  />
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
        </Dragable>
      </div>,
      this.domContainer
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  reactClickOutside(Window)
);
