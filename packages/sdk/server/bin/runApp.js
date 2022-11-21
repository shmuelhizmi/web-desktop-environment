#!/usr/bin/env node
/* eslint-disable */ 

const yargs = require("yargs")
const chalk = require("chalk")
const { runApp, getApps } = require("../lib/cli/runApp")

const appName = process.argv[2];
const input = yargs(process.argv.splice(3, process.argv.length)).argv;


if (appName) {
	runApp(appName, input).then(() => {
		process.exit();
	});
} else {
	getApps().then(apps => {
		const appsArr = Object.keys(apps);
		console.log(chalk.bold("Available apps:"));
		appsArr.forEach(app => {
			console.log((app));
		});
		console.log(chalk.bold("To run any of the apps, use the command:"));
		console.log(chalk.bold(chalk.green(chalk.bgBlack("run <app-name>"))));
		process.exit();
	});
}