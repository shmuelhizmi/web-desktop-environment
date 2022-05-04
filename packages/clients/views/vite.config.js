import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
import path from "path";

// allowSyntheticDefaultImports
export default defineConfig({
	envDir: "./env",
	plugins: [react(), tsconfigPaths(), svgrPlugin()],
	build: {
		sourcemap: true,
		outDir: "./build",
	},
	optimizeDeps: {
		esbuildOptions: {
			// plugins: [esbuildCommonjs()],
		},
	},
	resolve: {
		alias: [
			{
				find: /^@material-ui\/styles\/(.*)/,
				replacement: "@material-ui/styles/esm/$1",
			},
			{
				find: /^@material-ui\/utils\/(.*)/,
				replacement: "@material-ui/utils/esm/$1",
			},
		],
	},
});

// console.log(path.join(require.resolve("@material-ui/styles"), "../esm/"));
