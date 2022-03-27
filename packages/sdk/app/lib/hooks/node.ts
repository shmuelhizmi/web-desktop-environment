import { platform, tmpdir } from "os";
import * as SubProcess from "child_process";
import fs from "fs-extra";
import { useEffect, useMemo, useState } from "react";

export function usePlatform() {
	return useMemo(() => platform(), []);
}

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
	const platform = usePlatform();
	const [status, setStatus] = useState<"running" | "stopped" | "error">(
		"stopped"
	);
	const process = useMemo(() => {
		if (process) {
			process.kill();
		}
		if (command) {
			return SubProcess.spawn(command, args || [], {
				cwd,
				env,
			});
		}
		if (!script || !start) {
			return;
		}
		// write script to temp file
		const tmpFile = tmpdir() + "/" + Math.random().toString(36).substr(2);
		fs.writeFileSync(tmpFile, script);
		if (platform === "win32") {
			return SubProcess.spawn("cmd.exe", ["/c", tmpFile], {
				cwd,
				env,
			});
		}
		if (platform === "darwin" || platform === "linux") {
			return SubProcess.spawn("sh", [tmpFile], {
				cwd,
				env,
			});
		}
	}, [cwd, env, command, script, platform, start]);
	useEffect(() => {
		if (!process) {
			return;
		}
		process.on("error", (error) => {
			setStatus("error");
		});
		process.on("exit", (code, signal) => {
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
