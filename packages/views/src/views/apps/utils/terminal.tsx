import TerminalInterface from "@web-desktop-environment/interfaces/lib/views/apps/utils/Terminal";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import {
  withStyles,
  createStyles,
  WithStyles,
  withTheme,
  WithTheme,
} from "@material-ui/styles";
import { Theme } from "@root/theme";
import io from "socket.io-client";
import { reflowConnectionManager } from "@root/index";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      border: `1px solid ${theme.windowBorderColor}`,
      borderTop: "none",
      borderRadius: "0 0 15px 15px",
      background: theme.background.main,
      paddingBottom: 15,
      backdropFilter: "blur(15px)",
      boxShadow: `-10px 12px 20px -2px  ${theme.shadowColor}`,
      "& .xterm-viewport": {
        background: "#fff0",
      },
    },
  });

interface TerminalState {}

class Terminal extends ReflowReactComponent<
  TerminalInterface,
  WithStyles<typeof styles> & WithTheme<Theme>,
  TerminalState
> {
  socket: SocketIOClient.Socket;
  term: XTerm;
  termFit: FitAddon;
  containerElement?: HTMLElement;
  constructor(props: Terminal["props"]) {
    super(props);
    this.state = {};
    this.socket = io(`${reflowConnectionManager.host}:${props.port}`);
    this.term = new XTerm({
      theme: this.getTermTheme(),
      allowTransparency: true,
    });
    this.termFit = new FitAddon();
    this.term.loadAddon(this.termFit);
    this.socket.on("output", (data: string) => {
      this.term.write(data);
    });
    this.term.onData((data) => {
      this.socket.emit("input", data);
    });
  }

  getTermTheme = () => ({
    background: "#fff0",
    foreground: this.props.theme.background.text,
    cursor: this.props.theme.background.text,
  });

  handleClickOutside() {
    this.setState({ zIndex: 2 });
  }

  componentDidMount = () => {
    if (this.containerElement) {
      this.term.open(this.containerElement);
      this.termFit.fit();
    }
  };

  render() {
    const { classes } = this.props;
    this.term.setOption("theme", this.getTermTheme());
    this.termFit.fit();
    this.socket.emit("setColumns", this.term.cols);
    return (
      <div
        className={classes.root}
        ref={(div) => {
          if (div) {
            this.containerElement = div;
          }
        }}
      ></div>
    );
  }
}

export default withTheme(withStyles(styles, { withTheme: true })(Terminal));
