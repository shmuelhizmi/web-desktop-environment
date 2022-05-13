#!/usr/bin/node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { join } = require("path");

require("ts-node").register({
	project: join(__dirname, "../app/tsconfig.json"),
	transpileOnly: !(process.env.DEBUG || "").includes("TRANSPILE"),
});

require("../app");
