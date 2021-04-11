#!/usr/bin/env node
/* eslint-disable */ 

const yargs = require("yargs")
const { runApp } = require("../lib/cli/runApp")

const appName = process.argv[2];
const input = yargs(process.argv.splice(3, process.argv.length)).argv;


runApp(appName, input).then(() => {
	process.exit();
});