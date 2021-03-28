import React from "react";
import { connect } from "socket.io-client";
import {
	Client as FullstackClient,
	Views,
	ViewsToComponents,
} from "@react-fullstack/fullstack";

interface Props<ViewsInterface extends Views> {
	token: string;
	host: string;
	port: string;
	path: string;
	views: ViewsToComponents<ViewsInterface>;
}

class Client<ViewsInterface extends Views> extends React.Component<
	Props<ViewsInterface>
> {
	socket = connect(`${this.props.host}:${this.props.port}`, {
		transports: ["websocket"],
		path: this.props.path,
		extraHeaders: {
			Authorization: `Bearer ${this.props.token}`,
		},
	} as SocketIOClient.ConnectOpts);
	render() {
		const { views } = this.props;
		return (
			//@ts-ignore
			<FullstackClient<ViewsInterface> views={views} transport={this.socket} />
		);
	}
}

export default Client;
