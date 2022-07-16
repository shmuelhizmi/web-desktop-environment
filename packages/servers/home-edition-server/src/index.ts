import { startServer } from "@web-desktop-environment/server-sdk";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require("../package.json");

startServer(packageJSON, require.resolve("../package.json"));
