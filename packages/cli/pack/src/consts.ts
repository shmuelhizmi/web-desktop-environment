import path from "path";
import { readJSONSync } from "fs-extra";

export const PROJECT_DIR = process.cwd();
const APP_DIR = path.join(PROJECT_DIR, "./app/");
const WEB_DIR = path.join(PROJECT_DIR, "./web/");
const WEB_DIST_DIR = path.join(WEB_DIR, "./dist/web/");

const PACKAGE_JSON = readJSONSync(path.join(PROJECT_DIR, "./package.json"), {
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
};
const PACKAGE_NAME: string = PACKAGE_JSON.packageName;
const PACKAGE_VERSION: string = PACKAGE_JSON.version;
const WEB_BUNDLE_INDEX_FILE_NAME = `${PACKAGE_NAME}.bundle.js`;

export const PACKAGE_CONFIG = {
	name: PACKAGE_NAME,
	version: PACKAGE_VERSION,
	webBundle: {
		index: WEB_BUNDLE_INDEX_FILE_NAME,
		distDir: WEB_DIST_DIR,
	},
	entry: APP_DIR,
};

export const WEB_DESKTOP_ENVIRONMENT_CONFIG = "wde.config.json";
export const WEB_DESKTOP_ENVIRONMENT_CONFIG_PATH = path.join(
	PROJECT_DIR,
	WEB_DESKTOP_ENVIRONMENT_CONFIG
);

export const VITE_CONFIG = `
/* eslint-disable */
const path = require("path");
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "web"),
			name: ${JSON.stringify(PACKAGE_NAME)},
			fileName: "[name].bundle.js",
			formats: ["es"]
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["react"],
			output: {
				dir: path.resolve(__dirname, "dist/web"),
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					react: "React",
				},
			},
		},
	},
	plugins: [react()],
});
`;

export const VITE_CONFIG_PATH = path.join(PROJECT_DIR, "./vite.config.js");
