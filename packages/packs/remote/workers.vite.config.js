
/* eslint-disable */
const path = require("path");
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");
const { viteExternalsPlugin } = require("vite-plugin-externals")

module.exports = defineConfig({
	base: "./",
	build: {
		
		root: path.resolve(__dirname, "./web/"),
		rollupOptions: {
			output: {
				dir: path.resolve(__dirname, "./dist/web/"),
			},
			input: {"xpra":"/Users/shmuelh/Dev/web-desktop-environment/packages/packs/remote/web/xpraWorker","xpra-decoder":"/Users/shmuelh/Dev/web-desktop-environment/packages/packs/remote/web/xpraWorker/decoder"},
		},
	},
	plugins: [react(), viteExternalsPlugin({
		"react": "react",
	})],
});
