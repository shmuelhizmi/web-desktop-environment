#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { join } = require("path");

require("ts-node").register({
	project: join(__dirname, "../tsconfig.json"),
	transpileOnly: !(process.env.DEBUG || "").includes("TRANSPILE"),
	swc: true,
});

require("../src/build");
