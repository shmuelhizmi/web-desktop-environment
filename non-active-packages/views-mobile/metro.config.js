/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { join } = require("path");

module.exports = {
	resolver: {
		extraNodeModules: {
			http: join(__dirname, "index.js"), // mock reflow server modules
			"socket.io": join(__dirname, "index.js"), // mock reflow server modules
		},
	},
	transformer: {
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: false,
			},
		}),
	},
};
