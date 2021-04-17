import Emitter from "./Emitter";

export const lastTaskQueuer = () => {
	let stop = false;
	let isIdle = true;
	let lastTask: undefined | (() => Promise<void>);

	const continueEmitter = new Emitter<{ continue: void; idle: void }>();

	return {
		queueTask(newTask: () => Promise<void>) {
			lastTask = newTask;
			continueEmitter.call("continue", (null as unknown) as void);
		},
		stop() {
			stop = true;
		},
		idle() {
			return new Promise<void>((res) => {
				if (isIdle) {
					res();
				}
				continueEmitter.on("idle", res);
			});
		},
		async start() {
			while (!stop) {
				if (lastTask) {
					isIdle = false;
					const currentTask = lastTask;
					lastTask = undefined;
					await currentTask();
					isIdle = true;
				}
				if (!lastTask) {
					continueEmitter.call("idle", (null as unknown) as void);
					await new Promise((res) => continueEmitter.on("continue", res));
				}
			}
		},
	};
};
