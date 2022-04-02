#!/usr/bin/env ts-node
import {
	PACKAGE_CONFIG,
	WEB_DESKTOP_ENVIRONMENT_CONFIG_PATH,
	PROJECT_DIR,
	PACKAGE_JSON,
	PACKAGE_JSON_PATH,
	NPM_IGNORE,
	NPM_IGNORE_PATH,
} from "./consts";
import fs from "fs-extra";
import path from "path";
import { copyTemplate } from "./utils";

fs.writeJSON(WEB_DESKTOP_ENVIRONMENT_CONFIG_PATH, PACKAGE_CONFIG, {
	EOL: "\n",
	spaces: 2,
});

copyTemplate(path.join(__dirname, "./template"), PROJECT_DIR);

fs.writeJSON(PACKAGE_JSON_PATH, PACKAGE_JSON, {
	EOL: "\n",
	spaces: 2,
});

fs.writeFileSync(NPM_IGNORE_PATH, NPM_IGNORE);
