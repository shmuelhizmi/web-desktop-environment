#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { join } = require("path");

try {
	require("ts-node").register({
		project: join(__dirname, "../tsconfig.json"),
		transpileOnly: !(process.env.DEBUG || "").includes("TRANSPILE"),
		swc: !(process.env.DEBUG || "").includes("TRANSPILE"),
	});
} catch (e) {
	// ignore in production
}
require("../lib");
