import Emitter from "./Emitter";

export const lastTaskQueuer = () => {
	let stop = false;
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
			return new Promise((res) => {
				continueEmitter.on("idle", res);
			});
		},
		async start() {
			while (!stop) {
				if (lastTask) {
					const currentTask = lastTask;
					lastTask = undefined;
					await currentTask();
				}
				if (!lastTask) {
					continueEmitter.call("idle", (null as unknown) as void);
					await new Promise((res) => continueEmitter.on("continue", res));
				}
			}
		},
	};
};
