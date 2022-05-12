#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("ts-node").register({
	project: "../tsconfig.json",
	dir: "../lib",
});
