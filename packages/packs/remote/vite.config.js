/* eslint-disable */
const path = require("path");
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

module.exports = defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "web"),
			name: "remote-ui-package",
			fileName: (format) => `remote.${format}.js`,
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["react"],
			output: {
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
