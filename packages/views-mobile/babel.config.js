const { join } = require("path");

const srcDir = join(__dirname, "src");

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      "module-alias", [
        {
          "http": join(__dirname, "./App"),
        }
      ]
    ]
    [
      "module-resolver",
      {
        extensions: [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".android.js",
          ".android.tsx",
          ".ios.js",
          ".ios.ts",
        ],
        root: [srcDir],
        alias: {
          "@components": join(srcDir, "components"),
          "@views": join(srcDir, "views"),
          "@state": join(srcDir, "state"),
          "@root": srcDir,
          "@index": join(__dirname, "./App"),
        },
      },
    ],
  ],
};
