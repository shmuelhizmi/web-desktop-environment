#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("ts-node").register({
	// eslint-disable-next-line no-undef
	project: join(__dirname, "../tsconfig.json"),
	dir: "../lib",
	swc: true,
});

require("../lib");
