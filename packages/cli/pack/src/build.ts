#!/usr/bin/env ts-node
import { vite } from "./utils";
import fs from "fs-extra";
import { VITE_CONFIG, VITE_CONFIG_PATH } from "./consts";

(async () => {
    await fs.writeJSON(VITE_CONFIG_PATH, VITE_CONFIG);
    await vite.build();
    await fs.remove(VITE_CONFIG_PATH);
})();
