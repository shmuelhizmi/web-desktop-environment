#!/usr/bin/env node
const { join } = require("path");

require("ts-node").register({
	project: join(__dirname, "../tsconfig.json"),
});

require("../src/dev");
