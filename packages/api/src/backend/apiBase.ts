import { ChildProcess } from "child_process";
import ManagerBase from "./managerBase";

abstract class APIBase {
	private managers: { [name: string]: ManagerBase };
	private childProcess = new Set<ChildProcess>();
	protected registerManager(manager: ManagerBase) {
		manager.managerEmitter.on("callFunction", ({ id, name, parameters }) => {
			process.on("message", (message) => {
				if (
					message &&
					message.type === "api_super_response" &&
					message.id === id
				) {
					manager.managerEmitter.call("resolveFunction", {
						id,
						name,
						value: message.value,
					});
				}
			});
			if (process.send) {
				process.send({
					type: "api_super_request",
					id,
					managerName: manager.name,
					functionName: name,
					parameters,
				});
			} else {
				throw new Error(
					`manager(${manager.name}) is trying to call super function(${name}) but running from root process`
				);
			}
		});
		this.managers[manager.name] = manager;
	}
	protected addChildProcess(cp: ChildProcess) {
		let isAlive = true;
		cp.on("message", (message) => {
			if (message && message.type === "api_super_request") {
				const { id, managerName, functionName, parameters } = message;
				const targetManager = this.managers[managerName];
				if (!targetManager) {
					throw new Error(
						`child process is trying to access unknown manager(${managerName})`
					);
				}
				targetManager.functionHandlers[functionName](...parameters).then(
					(value) => {
						if (isAlive) {
							cp.emit("message", {
								type: "api_super_response",
								id,
								name: functionName,
								value,
							});
						}
					}
				);
			}
		});
		this.childProcess.add(cp);
		cp.on("exit", () => {
			isAlive = false;
			this.childProcess.delete(cp);
		});
	}
}

export default APIBase;
