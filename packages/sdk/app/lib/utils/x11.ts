import fs from "fs-extra";
import path from "path";
import ini from "ini";

export async function getX11AppIcon(
	iconName: string
): Promise<string | undefined> {
	const iconsFolder = "/usr/share/pixmaps/";
	const icons = await fs.readdir(iconsFolder);
	const icon = icons.reverse().find((icon) => icon.startsWith(iconName));
	if (icon) {
		return path.join(iconsFolder, icon);
	}
	return undefined;
}

export async function getX11AppIconAsImgUri(
	iconName: string
): Promise<string | undefined> {
	const { default: xpm2png } = await import("xpm2png");
	const path = await getX11AppIcon(iconName);
	if (!path) {
		return;
	}
	if (path.endsWith(".xpm")) {
		return await (await xpm2png(path, false)).getBase64Async("image/png");
	}
	if (path.endsWith(".png")) {
		const data = await fs.readFile(path);
		const base64 = data.toString("base64");
		return `data:image/png;base64,${base64}`;
	}
}

export async function getAllX11Apps() {
	const appsFolder = "/usr/share/applications/";
	const appsFiles = await fs.readdir(appsFolder);
	const appsConfig = appsFiles.filter((app) => app.endsWith(".desktop"));
	const apps = await Promise.all(
		appsConfig
			.map(async (app) => {
				const config = ini.parse(
					await fs.readFile(path.join(appsFolder, app), "utf-8")
				);
				return config["Desktop Entry"];
			})
			.map((app) =>
				app.then(async (app) => ({
					name: app["Name"],
					exec: app["Exec"],
					icon: app["Icon"],
					iconAsImgUri: await getX11AppIconAsImgUri(app["Icon"]),
					description: app["Comment"],
					filter: app["Terminal"] || app["Name"].toLowerCase().includes("xpra"),
				}))
			)
	);
	return apps.filter((app) => !app.filter);
}
