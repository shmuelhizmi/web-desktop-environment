import WindowInterface from "@web-desktop-environment/interfaces/lib/views/Window";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../theme";
import ReactDOM from "react-dom";
import reactClickOutside from "react-click-outside";
import Dragable from "react-draggable";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      boxShadow: "-10px 12px 20px -2px #0007",
    },
    bar: {
      background: "#dbdddd",
      borderRadius: "7px 7px 0 0",
    },
    body: {
      background: "#fff",
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
    },
    barButton: {
      width: 15,
      height: 15,
      borderRadius: "50%",
      border: "1px solid #0004",
    },
    barButtonExit: {
      background: "#e7252c",
      "&:hover": {
        background: "#ff001c",
      },
    },
    barButtonCollaps: {
      background: "#21b62f",
      "&:hover": {
        background: "#21c62f",
      },
    },
  });

interface WindowState {
  size: { height: number; width: number };
  zIndex: number;
  canDrag: boolean;
  collaps: boolean;
}

const defualtWindowSize = { height: 600, width: 700 };

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class Window extends ReflowReactComponent<
  WindowInterface,
  WithStyles<typeof styles>,
  WindowState
> {
  domContainer: Element;
  constructor(props: Window["props"]) {
    super(props);
    this.state = {
      size: {
        height: props.window.height || defualtWindowSize.height,
        width: props.window.width || defualtWindowSize.width,
      },
      zIndex: 2,
      canDrag: false,
      collaps: false,
    };
    this.domContainer = document.createElement("div");
    document.getElementById("app")?.appendChild(this.domContainer);
  }

  static windowBarHeight = 25;

  handleClickOutside() {
    this.setState({ zIndex: 2 });
  }

  render() {
    const { size, canDrag, zIndex, collaps } = this.state;
    const { children, classes, done } = this.props;
    return ReactDOM.createPortal(
      <Dragable
        disabled={!canDrag}
        onDrag={(e, postion) => {
          if (
            postion.y < 0 ||
            postion.y > window.screen.height - size.height ||
            postion.x < 0 ||
            postion.x > window.screen.width - size.width
          ) {
            return false;
          }
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
                onClick={() => done({})}
              />
              <div
                className={classes.barButton}
                style={{ background: "#af9941" }}
              />
              <div
                onClick={() => this.setState({ collaps: !collaps })}
                className={`${classes.barButton} ${classes.barButtonCollaps}`}
              />
            </div>
          </div>
          {!collaps && (
            <div
              className={classes.body}
              style={{ ...this.props.window, ...size }}
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
