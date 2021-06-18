import React from "react";
import { connect } from "socket.io-client";
import {
	Client as FullstackClient,
	Views,
	ViewsToComponents,
} from "@react-fullstack/fullstack";

interface Props<ViewsInterface extends Views> {
	port: number;
	host: string;
	socketOptions: SocketIOClient.ConnectOpts;
	views: ViewsToComponents<ViewsInterface>;
	missingToken: false;
}

class Client<ViewsInterface extends Views> extends React.Component<
	Props<ViewsInterface> | { missingToken: true }
> {
	socket?: SocketIOClient.Socket;
	componentDidMount = () => {
		if (!this.props.missingToken) {
			// if the token is missing at component mount time we do not expect it to change
			this.socket = connect(
				`${this.props.host}:${this.props.port}`,
				this.props.socketOptions
			);
			this.forceUpdate(() => {
				this.socket?.on("connect", () => {
					this.socket?.emit("request_views_tree");
				});
			});
		}
	};
	render() {
		if (!this.props.missingToken) {
			if (this.socket) {
				const { views } = this.props;
				return (
					<FullstackClient<ViewsInterface>
						views={views}
						transport={this.socket}
					/>
				);
			} else {
				return <> </>;
			}
		} else {
			return <> </>; // replace it with a no available session screen
		}
	}
}

export default Client;
