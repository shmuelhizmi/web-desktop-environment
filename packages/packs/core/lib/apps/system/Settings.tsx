import React from "react";
import { cpu, mem, osInfo, diskLayout } from "systeminformation";
import { PartialPartial } from "@web-desktop-environment/interfaces/lib/shared/types";
import { SystemInformation } from "@web-desktop-environment/interfaces/lib/views/apps/system/Settings";
import { AppBase, AppsManager } from "@web-desktop-environment/app-sdk";
import { Settings as SettingsObject } from "@web-desktop-environment/interfaces/lib/shared/settings";
interface SettingsState {
	systemInfo: PartialPartial<SystemInformation>;
	settings?: SettingsObject;
}

class Settings extends AppBase<{}, SettingsState> {
	name = "settings";
	constructor(props: AppBase<{}, SettingsState>["props"]) {
		super(props);
		this.state = {
			systemInfo: {},
			useDefaultWindow: true,
			defaultWindowTitle: "settings",
		};
	}

	updateSystemInfo = async () => {
		const [cpuInfo, memoryInfo, osInformation, diskInfo, settings] =
			await Promise.all([
				cpu(),
				mem(),
				osInfo(),
				diskLayout(),
				this.api.settingsManager.getSettings(),
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
			settings,
		});
	};
	onComponentWillUnmount: Function[] = [];
	componentWillUnmount = () => {
		this.onComponentWillUnmount.forEach((f) => f());
	};
	componentDidMount = () => {
		this.updateSystemInfo();
		const newSettingsListener = this.api.settingsManager.onNewSettings(
			(settings) => this.setState({ settings })
		);
		this.onComponentWillUnmount.push(newSettingsListener.remove);
	};
	renderApp: AppBase<{}, SettingsState>["renderApp"] = ({ Settings }) => {
		const { systemInfo, settings } = this.state;
		return (
			settings && (
				<Settings
					onReload={this.updateSystemInfo}
					setSettings={(newSettings) =>
						this.api.settingsManager.setSettings(newSettings)
					}
					settings={settings}
					systemInfo={systemInfo}
				/>
			)
		);
	};
}

export const registerApp = () =>
	AppsManager.registerApp({
		settings: {
			displayName: "Settings",
			description: "a system settings / info manager",
			App: Settings,
			defaultInput: {},
			icon: {
				type: "icon",
				icon: "FcSettings",
			},
			color: "#979896",
			window: {
				height: 600,
				width: 920,
				position: { x: 50, y: 50 },
				maxWidth: 1200,
				maxHeight: 900,
				minWidth: 500,
				minHeight: 600,
			},
		},
	});

const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
