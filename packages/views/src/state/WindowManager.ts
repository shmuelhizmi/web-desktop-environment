import { Icon } from "@web-desktop-environment/interfaces/lib/shared/icon";
import Emitter from "@utils/Emitter";

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
	setActiveWindow: {
		id: number;
	};
	updateZIndex: {
		id: number;
		layer: number;
	};
}

class WindowManager {
	public activeWindowId: number | undefined;
	public windows: Window[] = [];
	public windowsLayers: number[] = [];

	public emitter = new Emitter<WindowManagerEvent>();

	public readonly windowsMinMaxLayer = { min: 5, max: 200 };

	public sendWindowZIndex = () => {
		let currentZIndex = this.windowsMinMaxLayer.max;
		[...this.windowsLayers].reverse().forEach((id) => {
			this.emitter.call("updateZIndex", { id, layer: currentZIndex });
			if (currentZIndex > this.windowsMinMaxLayer.min) {
				currentZIndex--;
			}
		});
	};

	public setActiveWindow = (id: number) => {
		if (this.activeWindowId !== id) {
			this.activeWindowId = id;
			this.emitter.call("setActiveWindow", { id });
			this.windowsLayers = this.windowsLayers.filter(
				(currentId) => currentId !== id
			);
			this.windowsLayers.push(id);
			this.sendWindowZIndex();
		}
	};
	private idIndex = 0;
	public addWindow = (name: string, icon: Icon, state: WindowState) => {
		const id = this.idIndex;
		this.idIndex++;
		const newWindow = { id, name, icon, state };
		this.windows.push(newWindow);
		this.emitter.call("addWindow", { window: newWindow });
		this.windowsLayers.push(id);
		return id;
	};

	public closeWindow = (id: number) => {
		const windowToClose = this.windows.find((w) => w.id === id);
		if (windowToClose) {
			this.windows = this.windows.filter((w) => w.id !== id);
			this.emitter.call("closeWindow", { window: windowToClose });
			this.windowsLayers = this.windowsLayers.filter(
				(currentId) => currentId !== id
			);
		}
	};
	public updateState = (id: number, newState: WindowState) => {
		this.setActiveWindow(id);
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
