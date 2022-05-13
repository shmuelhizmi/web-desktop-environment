import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
import path from "path";

// allowSyntheticDefaultImports
globalThis.dir = __dirname;
export default defineConfig({
	envDir: "./env",
	plugins: [react(), tsconfigPaths(), svgrPlugin()],
	build: {
		sourcemap: true,
		outDir: "./build",
	},
	resolve: {
		alias: [
			{
				find: /^@mui\/styles\/(.*)/,
				replacement: "@mui/styles/esm/$1",
			},
			{
				find: /^@mui\/utils\/(.*)/,
				replacement: "@mui/utils/esm/$1",
			},
		],
	},
});

// console.log(path.join(require.resolve("@mui/styles"), "../esm/"));
