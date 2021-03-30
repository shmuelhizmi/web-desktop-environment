import React from "react";
import { Component } from "@react-fullstack/fullstack";
import TerminalInterface from "@web-desktop-environment/interfaces/lib/views/apps/utils/Terminal";
import {
	withStyles,
	createStyles,
	WithStyles,
	withTheme,
	WithTheme,
} from "@material-ui/styles";
import { Theme } from "@web-desktop-environment/interfaces/lib/shared/settings";
import io from "socket.io-client";
import { reactFullstackConnectionManager } from "@root/index";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import ResizeDetector from "react-resize-detector";
import "xterm/css/xterm.css";

const styles = (theme: Theme) =>
	createStyles({
		root: {
			width: "100%",
			height: "100%",
			border: theme.windowBorder
				? `1px solid ${theme.windowBorderColor}`
				: "none",
			borderTop: "none",
			borderRadius: "0 0 9px 9px",
			background: theme.background.main,
			backdropFilter: "blur(15px)",
			boxShadow: `-10px 12px 20px -2px  ${theme.shadowColor}`,
		},
		body: {
			height: "calc(100% - 8px)",
			width: "100%",
			"& .xterm-viewport": {
				background: "#fff0",
			},
		},
	});

class Terminal extends Component<
	TerminalInterface,
	{},
	WithStyles<typeof styles> & WithTheme<Theme>
> {
	socket: SocketIOClient.Socket;
	term: XTerm;
	termFit: FitAddon;
	containerElement?: HTMLElement;
	constructor(props: Terminal["props"]) {
		super(props);
		this.socket = io(`${reactFullstackConnectionManager.host}:${props.port}`, {
			transports: ["websocket"],
		});
		this.term = new XTerm({
			theme: this.getTermTheme(),
			fontFamily: "JetBrains Mono",
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

	componentDidMount = () => {
		if (this.containerElement) {
			this.term.open(this.containerElement);
			this.termFit.fit();
		}
	};

	componentWillUnmount = () => {
		this.socket.close();
	};

	onResize = () => {
		if (this.containerElement?.clientWidth) {
			// do not resize is container is in display: none mode
			this.termFit.fit();
			this.socket.emit("setColumns", this.term.cols);
		}
	};

	render() {
		const { classes } = this.props;
		this.term.setOption("theme", this.getTermTheme());
		this.onResize();
		return (
			<ResizeDetector onResize={this.onResize}>
				<div className={classes.root}>
					<div
						className={classes.body}
						ref={(div) => {
							if (div) {
								this.containerElement = div;
							}
						}}
					></div>
				</div>
			</ResizeDetector>
		);
	}
}

export default withTheme(withStyles(styles, { withTheme: true })(Terminal));
