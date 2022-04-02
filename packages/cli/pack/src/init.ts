#!/usr/bin/env ts-node
import {
	PACKAGE_CONFIG,
	WEB_DESKTOP_ENVIRONMENT_CONFIG_PATH,
	PROJECT_DIR,
} from "./consts";
import fs from "fs-extra";
import path from "path";
import { copyTemplate } from "./utils";

fs.writeJSON(WEB_DESKTOP_ENVIRONMENT_CONFIG_PATH, PACKAGE_CONFIG, {
	EOL: "\n",
	spaces: 2,
});

copyTemplate(path.join(__dirname, "./template"), PROJECT_DIR);
