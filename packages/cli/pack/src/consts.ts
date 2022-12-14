import path from "path";
import { readJSONSync } from "fs-extra";
import { InlineConfig } from "vite";
import worker, { pluginHelper } from "vite-plugin-worker";
import react from "@vitejs/plugin-react";
import { viteExternalsPlugin } from "vite-plugin-externals";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";

export const PROJECT_DIR = process.cwd();
export const PACKAGE_JSON_PATH = path.join(PROJECT_DIR, "./package.json");

export const PACKAGE_JSON = readJSONSync(PACKAGE_JSON_PATH, {
	throws: false,
}) || {
	name: "example-web-desktop-package",
	packageName: "example-web-desktop-package",
	version: "0.0.1",
	description: "an example web desktop package",
	dependencies: {
		"@web-desktop-environment/interfaces": "latest",
		"@web-desktop-environment/web-sdk": "latest",
		"@web-desktop-environment/app-sdk": "latest",
	},
	devDependencies: {
		"@web-desktop-environment/package-cli": "latest",
	},
	script: {
		build: "wde-build",
	},
};

export const NPM_IGNORE_PATH = path.join(PROJECT_DIR, "./.npmignore");
export const NPM_IGNORE = `
./web/
`;

const PACKAGE_NAME: string = PACKAGE_JSON.packageName || PACKAGE_JSON.name;
const PACKAGE_VERSION: string = PACKAGE_JSON.version;

export const WEB_DESKTOP_ENVIRONMENT_CONFIG = "wde.config.json";
export const WEB_DESKTOP_ENVIRONMENT_CONFIG_PATH = path.join(
	PROJECT_DIR,
	WEB_DESKTOP_ENVIRONMENT_CONFIG
);
export const PACKAGE_CONFIG = readJSONSync(
	WEB_DESKTOP_ENVIRONMENT_CONFIG_PATH
) || {
	name: PACKAGE_NAME,
	version: PACKAGE_VERSION,
	webBundle: {
		distDir: "./dist/web/",
	},
	entry: "./app",
	web: "./web",
};

export const VITE_CONFIG: InlineConfig = {
	base: "./",
	root: path.resolve(PROJECT_DIR, PACKAGE_CONFIG.web || "./web"),
	build: {
		lib: {
			entry: path.resolve(PROJECT_DIR, PACKAGE_CONFIG.web || "./web"),
			name: PACKAGE_NAME,
			fileName: "[name].bundle",
			formats: ["es"],
		},
		rollupOptions: {
			output: {
				dir: path.resolve(
					PROJECT_DIR,
					PACKAGE_CONFIG.webBundle?.distDir || "./dist/web/"
				),
			},
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			plugins: [esbuildCommonjs()],
		},
	},
	plugins: [
		react({
			include: ["**/*.{tsx}"],
		}),
		viteExternalsPlugin({
			react: "react",
		}),
		worker({}),
		pluginHelper(),
	],
};
