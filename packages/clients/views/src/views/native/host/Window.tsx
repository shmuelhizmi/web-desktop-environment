import React from "react";
import { Component } from "@react-fullstack/fullstack/client";
import WindowInterface from "@web-desktop-environment/interfaces/lib/views/Window";
import windowManager from "@state/WindowManager";
import { ConnectionContext } from "@root/contexts";

class Window extends Component<WindowInterface, {}> {
	id!: number;
	window?: globalThis.Window;

	static contextType = ConnectionContext;
	context!: React.ContextType<typeof ConnectionContext>;

	isUnmounted = false;
	openWindow = () => {
		this.window =
			window.open(
				`${window.location.origin}/view/app-${this.context?.id}`,
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
					if (!this.isUnmounted) {
						this.props.onClose();
						windowManager.closeWindow(this.id);
					}
					clearInterval(closeInterval);
				}
			}, 250);
		}
	};

	componentDidMount = () => {
		window.addEventListener("unload", () => {
			this.window?.close();
		});
		this.id = windowManager.addWindow(
			this.props.name,
			this.props.icon,
			this.props.color,
			{
				minimized: this.props.window.minimized || false,
			}
		);
		windowManager.emitter.on("maximizeWindow", ({ id }) => {
			if (id === this.id) {
				if (!this.window) {
					this.openWindow();
				} else {
					this.window.focus();
				}
			}
		});
		windowManager.emitter.on("minimizeWindow", ({ id }) => {
			if (id === this.id) {
				if (!this.window) {
					this.openWindow();
				}
				this.window?.blur();
			}
		});
		this.openWindow();
	};

	componentWillUnmount = () => {
		this.isUnmounted = true;
		this.window?.close();
		windowManager.closeWindow(this.id);
	};

	render() {
		return <></>;
	}
}

export default Window;
