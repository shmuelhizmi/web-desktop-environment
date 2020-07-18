import { App } from "@apps/index";
import { settingManager } from "@index";
import { cpu, mem, osInfo, diskLayout } from "systeminformation";

interface SettingsInput {}

const terminalFlow = <App<SettingsInput>["flow"]>(async ({
  view,
  views,
  input: { parentLogger },
}) => {
  const logger = parentLogger.mount("settings-app");
  const settings = view(0, views.settings, {
    settings: settingManager.settings,
  });

  settingManager.emitter.on("onNewSettings", (newSettings) => {
    settings.update({ settings: newSettings });
  });

  const updateSystemInfo = async () => {
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
        speed: cpuInfo.speed,
        speedMax: cpuInfo.speedmax,
        speedMin: cpuInfo.speedmin,
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
    logger.info("fetch system info");
    settings.update({
      systemInfo,
    });
  };

  settings.on("setSettings", (newSettings) => {
    logger.info("settings update");
    settingManager.setSettings(newSettings);
  });
  settings.on("reload", updateSystemInfo);
  await updateSystemInfo();

  await settings;
});

export const settings: App<SettingsInput> = {
  name: "Settings",
  description: "a system settings / info mnager",
  flow: terminalFlow,
  defaultInput: {},
  icon: {
    type: "icon",
    icon: "IoMdSettings",
  },
  window: {
    height: 600,
    width: 920,
    position: { x: 50, y: 50 },
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
