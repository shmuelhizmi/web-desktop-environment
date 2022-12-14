#!/usr/bin/env ts-node-cwd
import { vite } from "./utils";
import { VITE_CONFIG } from "./consts";

vite.build(VITE_CONFIG);
