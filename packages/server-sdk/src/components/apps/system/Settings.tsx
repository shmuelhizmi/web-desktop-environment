import React from "react";
import Component from "@component";
import { ViewsProvider } from "@react-fullstack/fullstack";
import { App } from "@apps/index";
import { cpu, mem, osInfo, diskLayout } from "systeminformation";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces/lib";
import { PartialPartial } from "@web-desktop-environment/interfaces/lib/shared/types";
import { SystemInformation } from "@web-desktop-environment/interfaces/lib/views/apps/system/Settings";

interface SettingsState {
	systemInfo: PartialPartial<SystemInformation>;
}

class Settings extends Component<{}, SettingsState> {
	name = "settings";
	state: SettingsState = {
		systemInfo: {},
	};
	updateSystemInfo = async () => {
		const [cpuInfo, memoryInfo, osInformation, diskInfo] = await Promise.all([
			cpu(),
			mem(),
			osInfo(),
			diskLayout(),
		]);
		const systemInfo = {
			cpu: {
				cores: cpuInfo.cores,
				brandName: cpuInfo.brand,
				manufacturer: cpuInfo.manufacturer,
				physicalCores: cpuInfo.physicalCores,
				speed: cpuInfo.speed.toString(),
				speedMax: cpuInfo.speedMax.toString(),
				speedMin: cpuInfo.speedMin.toString(),
			},
			os: {
				hostname: osInformation.hostname,
				platform: osInformation.platform,
				kernel: osInformation.kernel,
			},
			ram: {
				free: formatBytes(memoryInfo.available),
				total: formatBytes(memoryInfo.total),
			},
			disks: diskInfo.map((disk) => ({
				name: disk.name,
				total: formatBytes(disk.size),
				vendor: disk.vendor,
			})),
		};
		this.logger.info("fetch system info");
		this.setState({
			systemInfo,
		});
	};
	componentDidMount = () => {
		this.updateSystemInfo();
		const newSettingsListener = this.desktopManager.settingsManager.emitter.on(
			"onNewSettings",
			() => this.forceUpdate()
		);
		this.onComponentWillUnmount.push(newSettingsListener.remove);
	};
	renderComponent() {
		const { systemInfo } = this.state;
		return (
			<ViewsProvider<ViewInterfacesType>>
				{({ Settings }) => (
					<Settings
						onReload={this.updateSystemInfo}
						setSettings={(newSettings) =>
							this.desktopManager.settingsManager.setSettings(newSettings)
						}
						settings={this.desktopManager.settingsManager.settings}
						systemInfo={systemInfo}
					/>
				)}
			</ViewsProvider>
		);
	}
}

export const settings: App<{}> = {
	name: "Settings",
	description: "a system settings / info manager",
	App: Settings,
	defaultInput: {},
	icon: {
		type: "icon",
		icon: "FcSettings",
	},
	nativeIcon: {
		icon: "ios-settings",
		type: "Ionicons",
	},
	window: {
		height: 600,
		width: 920,
		position: { x: 50, y: 50 },
		maxWidth: 1200,
		maxHeight: 900,
		minWidth: 500,
		minHeight: 600,
	},
};

const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
