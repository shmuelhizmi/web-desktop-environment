import path from "path";
import { readJSONSync } from "fs-extra";

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

export const VITE_CONFIG = `
/* eslint-disable */
const {pluginHelper, default: worker} = require('vite-plugin-worker')
const path = require("path");
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");
const { viteExternalsPlugin } = require("vite-plugin-externals")
const { esbuildCommonjs } = require("@originjs/vite-plugin-commonjs");

module.exports = defineConfig({
	base: "./",
	build: {
		lib: {
			entry: path.resolve(__dirname, ${JSON.stringify(
				PACKAGE_CONFIG.web || "./web"
			)}),
			name: ${JSON.stringify(PACKAGE_NAME)},
			fileName: "[name].bundle",
			formats: ["esm"]
		},
		root: path.resolve(__dirname, ${JSON.stringify(PACKAGE_CONFIG.web || "./web")}),
		rollupOptions: {
			output: {
				dir: path.resolve(__dirname, ${JSON.stringify(
					PACKAGE_CONFIG.webBundle?.distDir || "./dist/web/"
				)}),
			},
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			plugins: [esbuildCommonjs()],
		},
	},
	plugins: [react({
		include: [
			"**/*.{tsx}",
		],
	}), viteExternalsPlugin({
		"react": "react",
	}),
	worker({}),
	pluginHelper(),
  ],
});
`;

export const VITE_CONFIG_PATH = path.join(PROJECT_DIR, "./vite.config.js");
