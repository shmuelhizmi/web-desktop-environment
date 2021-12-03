import * as os from "os";
import * as cp from "child_process";
import Logger from "../utils/logger";
import DesktopManager from "../managers/desktopManager";

type InitResult = { success: false } | { success: true; port: number };

export class GTKBridge {
	logger: Logger;
	desktopManager: DesktopManager;
	constructor(parentLogger: Logger, desktopManager: DesktopManager) {
		this.logger = parentLogger.mount("GTK-Bridge");
		this.desktopManager = desktopManager;
	}

	async initialize(): Promise<InitResult> {
		if (os.platform() !== "linux") {
			return { success: false };
		}
		try {
			const broadwaydExist = await exists("broadwayd");
			if (!broadwaydExist) {
				this.logger.warn(
					"seems like gtk3 broadwayd isn't installed, note that you can gain access to thousands of apps by installing broadwayd on your PC"
				);
				return { success: false };
			}
			const port = await this.desktopManager.portManager.getPort();
			const broadwayd = cp.exec(`broadwayd --port=${port} :${port}`);
			let broadwaydExited = false;
			broadwayd.on("exit", () => (broadwaydExited = true));
			await new Promise((res) => setTimeout(res, 3000));

			if (!broadwaydExited) {
				process.env["GDK_BACKEND"] = "broadway";
				process.env["BROADWAY_DISPLAY"] = `:${port}`;
				process.env["DISPLAY"] = `:${port}`;
				return { success: true, port };
			} else {
				return { success: false };
			}
		} catch (err) {
			return {
				success: false,
			};
		}
	}
}

function run(command: string) {
	return new Promise<string>((fulfill, reject) => {
		cp.exec(command, (err, stdout, stderr) => {
			if (err) {
				reject(err);
				return;
			}

			if (stderr) {
				reject(new Error(stderr));
				return;
			}

			fulfill(stdout);
		});
	});
}

// https://gist.github.com/jmptable/7a3aa580efffdef50fa9f0dd3d068d6f
// returns Promise which fulfills with true if command exists
function exists(cmd: string) {
	return run(`which ${cmd}`).then((stdout) => {
		if (stdout.trim().length === 0) {
			// maybe an empty command was supplied?
			// are we running on Windows??
			return Promise.reject(new Error("No output"));
		}

		const rNotFound = /^[\w-]+ not found/g;

		if (rNotFound.test(cmd)) {
			return Promise.resolve(false);
		}

		return Promise.resolve(true);
	});
}
