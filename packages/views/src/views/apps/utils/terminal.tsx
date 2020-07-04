import TerminalInterface from "@web-desktop-environment/interfaces/lib/views/apps/utils/Terminal";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import * as React from "react";
import { withStyles, createStyles, WithStyles } from "@material-ui/styles";
import { Theme } from "../../../theme";
import io from "socket.io-client";
import { reflowConnectionManager } from "../../..";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Key } from "ts-keycode-enum";
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

export const deleteKey = "\b \b";

const createDelete = (length: number) => {
  let deleteCount = length;
  let lineReseter = "";
  while (deleteCount > 0) {
    deleteCount--;
    lineReseter += deleteKey;
  }
  return lineReseter;
};

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class Terminal extends ReflowReactComponent<
  TerminalInterface,
  WithStyles<typeof styles>,
  TerminalState
> {
  socket: SocketIOClient.Socket;
  term: XTerm;
  termFit: FitAddon;
  inputBuffer: string;
  constructor(props: Terminal["props"]) {
    super(props);
    this.state = {};
    this.socket = io(`${reflowConnectionManager.host}:${props.port}`);
    this.term = new XTerm();
    this.termFit = new FitAddon();
    this.term.loadAddon(this.termFit);
    this.socket.on("out", (data: string) => {
      const lines = data.split("\n");
      lines.forEach((line, index) => {
        this.term.write(line);
        if (index !== lines.length - 1) {
          this.term.write("\n");
          this.term.write(createDelete(line.length));
        }
      });
    });
    this.inputBuffer = "";
    this.term.onKey(({ key, domEvent }) =>
      this.onKeyDown(key, domEvent.keyCode)
    );
  }

  onKeyDown = (key: string, keyCode: number) => {
    if (keyCode === Key.Enter) {
      // send command
      this.socket.emit("in", this.inputBuffer + "\n");
      this.term.write(createDelete(this.inputBuffer.length));
      this.term.write("\n");
      this.term.write(createDelete(this.term.cols));
      this.inputBuffer = "";
      return;
    }
    if (keyCode === Key.Backspace) {
      // on delete
      if (this.inputBuffer.length > 0) {
        this.inputBuffer = String(this.inputBuffer.slice(0, -1));
        console.log(this.inputBuffer);
        this.term.write(deleteKey);
      }
      return;
    }
    if (
      keyCode === Key.UpArrow ||
      keyCode === Key.DownArrow ||
      keyCode === Key.RightArrow ||
      keyCode === Key.LeftArrow
    ) {
      this.socket.emit("inkey", keyCode);
      return;
    }
    this.inputBuffer += key;
    this.term.write(key);
  };

  handleClickOutside() {
    this.setState({ zIndex: 2 });
  }

  render() {
    const { port, classes } = this.props;
    return (
      <div
        className={classes.root}
        ref={(div) => {
          if (div) {
            this.term.open(div);
            this.termFit.fit();
          }
        }}
      ></div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Terminal);
