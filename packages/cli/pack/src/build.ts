#!/usr/bin/env ts-node
import { vite } from "./utils";
import fs from "fs-extra";
import { VITE_CONFIG, VITE_CONFIG_PATH } from "./consts";

fs.writeFileSync(VITE_CONFIG_PATH, VITE_CONFIG);
vite.build();
fs.removeSync(VITE_CONFIG_PATH);
