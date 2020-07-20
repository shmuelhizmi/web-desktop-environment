import { Icon } from "@web-desktop-environment/interfaces/lib/shared/icon";
import Emitter from "@state/Emitter";

export interface Window {
	id: number;
	name: string;
	icon: Icon;
	state: WindowState;
}

interface WindowState {
	minimized: boolean;
}

interface WindowManagerEvent {
	maximizeWindow: {
		id: number;
	};
	minimizeWindow: {
		id: number;
	};
	addWindow: {
		window: Window;
	};
	closeWindow: {
		window: Window;
	};
}

class WindowManager {
	public windows: Window[] = [];

	public emitter = new Emitter<WindowManagerEvent>();

	public addWindow = (name: string, icon: Icon, state: WindowState) => {
		const id = this.windows.length;
		const newWindow = { id, name, icon, state };
		this.windows.push(newWindow);
		this.emitter.call("addWindow", { window: newWindow });
		return id;
	};

	public closeWindow = (id: number) => {
		const windowToClose = this.windows.find((w) => w.id === id);
		if (windowToClose) {
			this.windows = this.windows.filter((w) => w.id !== id);
			this.emitter.call("closeWindow", { window: windowToClose });
		}
	};

	public updateState = (id: number, newState: WindowState) => {
		const currentWindow = this.windows.find((w) => w.id === id);
		if (currentWindow) {
			const { minimized } = currentWindow.state;
			currentWindow.state = newState;
			if (newState.minimized !== minimized) {
				if (newState.minimized) {
					this.emitter.call("minimizeWindow", { id });
				} else {
					this.emitter.call("maximizeWindow", { id });
				}
			}
		}
	};
}

export default new WindowManager();
