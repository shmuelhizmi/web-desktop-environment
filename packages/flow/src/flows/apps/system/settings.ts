import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces/lib";
import { App } from "..";
import { settingManager } from "../../..";
import { cpu, mem, osInfo, diskLayout } from "systeminformation";

interface SettingsInput {}

const terminalFlow = <Flow<ViewInterfacesType, SettingsInput>>(async ({
  view,
  views,
  input: {},
}) => {
  const settings = view(0, views.settings, {
    settings: settingManager.settings,
  });

  const updateSystemInfo = async () => {
    const [cpuInfo, memoryInfo, osInformation, diskInfo] = await Promise.all([
      cpu(),
      mem(),
      osInfo(),
      diskLayout(),
    ]);
    settings.update({
      systemInfo: {
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
          freeInGabytes: memoryInfo.free / 1073741824, //giga
          totalInGabytes: memoryInfo.total / 1073741824,
        },
        disks: diskInfo.map((disk) => ({
          name: disk.name,
          totalInGabytes: disk.size / 1073741824,
          vendor: disk.vendor,
        })),
      },
    });
  };

  settings.on("setSettings", (newSettings) =>
    settingManager.setSettings(newSettings)
  );
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
    type: "fluentui",
    icon: "Settings",
  },
  window: {
    height: 600,
    width: 920,
    position: { x: 50, y: 50 },
  },
};
