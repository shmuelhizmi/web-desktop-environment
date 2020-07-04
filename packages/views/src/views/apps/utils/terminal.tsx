import TerminalInterface from "@web-desktop-environment/interfaces/lib/views/apps/utils/Terminal";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../../../theme";
import io from "socket.io-client";
import { reflowConnectionManager } from "../../..";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      border: "none",
    },
  });

interface TerminalState {}

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class Terminal extends ReflowReactComponent<
  TerminalInterface,
  WithStyles<typeof styles>,
  TerminalState
> {
  socket: SocketIOClient.Socket;
  term: XTerm;
  constructor(props: Terminal["props"]) {
    super(props);
    this.state = {};
    this.socket = io(`${reflowConnectionManager.host}:${props.port}`);
    this.term = new XTerm();
    this.socket.on("out", (data: any) => this.term.write(data));
    let buffer = "";
    this.term.onKey(({domEvent}) => {
      if (domEvent.keyCode === 13) {
        this.socket.emit("in", buffer);
        buffer = "";
      }
    })
    this.term.onData((data) => {
      this.term.write(data);
      buffer+= data;
    })
  }

  handleClickOutside() {
    this.setState({ zIndex: 2 });
  }

  render() {
    const { port, classes } = this.props;
    return (
      <div
        className={classes.root}
        ref={(div) => div && this.term.open(div)}
      ></div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Terminal);
