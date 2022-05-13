import os from "os";
import * as cp from "child_process";
import fs from "fs-extra";
import { useEffect, useMemo, useState } from "react";
import API from "@web-desktop-environment/server-api";

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
	const [process, setProcess] = useState<cp.ChildProcess | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [restartIndex, setRestartIndex] = useState<number>(0);
	useEffect(() => {
		if (process) {
			process.kill();
			setProcess(null);
		}
		if (!start) {
			return;
		}
		if (command) {
			setProcess(
				cp.spawn(command, args || [], {
					cwd,
					env,
					stdio: "pipe",
				})
			);
			setStatus("running");
			return;
		}
		if (!script) {
			return;
		}
		// write script to temp file
		const tmpFile = os.tmpdir() + "/" + Math.random().toString(36).substr(2);
		fs.writeFileSync(tmpFile, script);
		if (platform === "win32") {
			setProcess(
				cp.spawn("cmd.exe", ["/c", tmpFile], {
					cwd,
					env,
				})
			);
			setStatus("running");
		}
		if (platform === "darwin" || platform === "linux") {
			setProcess(
				cp.spawn("sh", [tmpFile], {
					cwd,
					env,
				})
			);
			setStatus("running");
		}
	}, [cwd, env, command, script, platform, start, restartIndex]);
	useEffect(() => {
		if (!process) {
			return;
		}
		process.on("error", (err) => {
			setError(err);
		});
		process.on("exit", (code, _s) => {
			if (code === 0) {
				setStatus("stopped");
			} else {
				setStatus("error");
			}
			setProcess(null);
		});
	}, [process]);
	return {
		status,
		process,
		error,
		restart: () => {
			setRestartIndex(restartIndex + 1);
			if (process) {
				process.kill();
				setProcess(null);
			}
		},
		kill: () => process && process.kill(),
	};
}
