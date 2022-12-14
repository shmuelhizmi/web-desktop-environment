import { build, InlineConfig, createServer } from "vite";

export const vite = {
	build(config: InlineConfig) {
		return build(config) as unknown as Promise<void>;
	},
	dev(config: InlineConfig) {
		return createServer(config).then((server) => server.listen());
	},
};
