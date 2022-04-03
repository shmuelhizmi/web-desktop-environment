import os from "os";
import * as SubProcess from "child_process";
import fs from "fs-extra";
import { useEffect, useState } from "react";

interface UseProcessOptions {
	cwd?: string;
	env?: NodeJS.ProcessEnv;
	command?: string;
	args?: string[];
	script?: string;
	start?: boolean;
}

export function useProcess(props: UseProcessOptions) {
	const { cwd, env, command, script, start = true, args } = props;
	const platform = os.platform();
	const [status, setStatus] = useState<"running" | "stopped" | "error">(
		"stopped"
	);
	const [process, setProcess] = useState<SubProcess.ChildProcess | null>(null);
	useEffect(() => {
		if (process) {
			process.kill();
		}
		if (command) {
			setProcess(
				SubProcess.spawn(command, args || [], {
					cwd,
					env,
				})
			);
		}
		if (!script || !start) {
			return;
		}
		// write script to temp file
		const tmpFile = os.tmpdir() + "/" + Math.random().toString(36).substr(2);
		fs.writeFileSync(tmpFile, script);
		if (platform === "win32") {
			setProcess(
				SubProcess.spawn("cmd.exe", ["/c", tmpFile], {
					cwd,
					env,
				})
			);
		}
		if (platform === "darwin" || platform === "linux") {
			setProcess(
				SubProcess.spawn("sh", [tmpFile], {
					cwd,
					env,
				})
			);
		}
	}, [cwd, env, command, script, platform, start]);
	useEffect(() => {
		if (!process) {
			return;
		}
		process.on("error", () => {
			setStatus("error");
		});
		process.on("exit", (code) => {
			if (code === 0) {
				setStatus("stopped");
			} else {
				setStatus("error");
			}
		});
	}, [process]);
	return {
		status,
		process,
		kill: () => process && process.kill(),
	};
}
