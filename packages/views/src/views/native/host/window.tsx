import WindowInterface from "@web-desktop-environment/interfaces/lib/views/Window";
import { ReflowReactComponent } from "@mcesystems/reflow-react-display-layer";
import React from "react";
import windowManager from "@state/WindowManager";
import { ConnectionContext } from "./desktop";

class Window extends ReflowReactComponent<WindowInterface, {}> {
	id!: number;
	window?: globalThis.Window;

	static contextType = ConnectionContext;
	context!: React.ContextType<typeof ConnectionContext>;

	openWindow = () => {
		this.window =
			window.open(
				`${window.location.origin}/native/client/connect/${this.context?.host}/${this.context?.port}`,
				"",
				`width=${this.props.window.width},height=${this.props.window.height}`
			) || undefined;
		if (this.window) {
			const { position } = this.props.window;
			if (position) {
				this.window.moveTo(position.x, position.y);
			}
			const closeInterval = setInterval(() => {
				if (this.window?.closed) {
					this.props.done({});
					windowManager.closeWindow(this.id);
					clearInterval(closeInterval);
				}
			}, 250);
		}
	};

	componentDidMount = () => {
		window.addEventListener("unload", () => {
			this.window?.close();
		});
		this.id = windowManager.addWindow(this.props.name, this.props.icon, {
			minimized: this.props.window.minimized || false,
		});
		windowManager.emitter.on("maximizeWindow", ({ id }) => {
			if (id === this.id) {
				if (!this.window) {
					this.openWindow();
				} else {
					this.window.focus();
				}
			}
		});
		this.openWindow();
	};

	componentWillUnmount = () => {
		this.window?.close();
		windowManager.closeWindow(this.id);
	};

	render() {
		return <></>;
	}
}

export default Window;
