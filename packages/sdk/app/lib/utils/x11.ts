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
	const dirs = [home, ...xdgDataDirs, pixmaps, ...(await getThemeIconsPath())];
	const files = await Promise.all(
		dirs.map(async (dir) => {
			if (!(await fs.pathExists(dir))) {
				return [];
			}
			const files = await fs.readdir(dir);
			return files.map((file) => path.join(dir, file));
		}) as Promise<string[]>[]
	);
	return files.flat().reduce((acc, val) => {
		const fileName = path.basename(val);
		const withoutExtension = fileName.split(".")[0];
		acc[withoutExtension] = val;
		return acc;
	}, {} as Record<string, string>);
}

function getAllSubDirectories(dir: string) {
	return fs
		.readdir(dir)
		.then((files) =>
			Promise.all(
				files.map(async (file) => {
					const fullPath = path.join(dir, file);
					const isDirectory = (await fs.stat(fullPath)).isDirectory();
					return isDirectory ? fullPath : null;
				})
			)
		)
		.then((dirs) => dirs.filter((dir) => dir !== null) as string[]);
}

export async function getThemeIconsPath(): Promise<string[]> {
	const themeIconsPath = "/usr/share/icons";
	const themes = await getAllSubDirectories(themeIconsPath);
	const sizes = await Promise.all(themes.map(getAllSubDirectories)).then(
		(dirs) => dirs.flat()
	);
	const iconsDirs = await Promise.all(
		sizes.map(async (dir) => {
			return fs.pathExists(path.join(dir, "apps")).then((exists) => {
				return exists ? path.join(dir, "apps") : null;
			});
		})
	).then((dirs) => dirs.filter((dir) => dir !== null) as string[]);
	return iconsDirs;
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
		const data = await fs.readFile(iconPath);
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
						(
							await appsIconsPromise
						)[app["Icon"]]
					),
					description: app["Comment"],
					filter: app["Terminal"] || app["Name"].toLowerCase().includes("xpra"),
				}))
			)
	);
	return apps.filter((app) => !app.filter);
}
