import fs from "fs-extra";
import path from "path";
import ini from "ini";

export async function getAllX11Icons() {
	const home = process.env.HOME && path.join(process.env.HOME, ".icons");
	const xdgDataDirs =
		process.env.XDG_DATA_DIRS?.split(":").map((dir) =>
			path.join(dir, "icons")
		) || [];
	const pixmaps = "/usr/share/pixmaps";
	const dirs = [home, ...xdgDataDirs, pixmaps];
	return (
		await Promise.all(
			dirs.map(async (dir) => {
				if (!(await fs.pathExists(dir))) {
					return [];
				}
				const files = await fs.readdir(dir);
				return files.map((file) => path.join(dir, file));
			}) as Promise<string[]>[]
		)
	)
		.flat()
		.reduce((acc, val) => {
			const fileName = path.basename(val);
			const withoutExtension = fileName.split(".")[0];
			acc[withoutExtension] = val;
			return acc;
		}, {} as Record<string, string>);
}

export async function getX11AppIconAsImgUri(
	iconPath?: string
): Promise<string | undefined> {
	if (!iconPath) {
		return;
	}
	if (
		iconPath.endsWith(".png") ||
		iconPath.endsWith(".svg") ||
		iconPath.endsWith(".ico") ||
		iconPath.endsWith(".gif")
	) {
		const ext = path.extname(iconPath);
		const data = await fs.readFile(path);
		const base64 = data.toString("base64");
		return `data:image/${ext};base64,${base64}`;
	}
	return undefined;
}

export async function getAllX11Apps() {
	const appsFolder = "/usr/share/applications/";
	const appsIconsPromise = getAllX11Icons();
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
					iconAsImgUri: await getX11AppIconAsImgUri(
						await appsIconsPromise[app["Icon"]]
					),
					description: app["Comment"],
					filter: app["Terminal"] || app["Name"].toLowerCase().includes("xpra"),
				}))
			)
	);
	return apps.filter((app) => !app.filter);
}
