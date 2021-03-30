import Emitter from "./Emitter";

export const lastTaskQueuer = () => {
	let stop = false;
	let lastTask: () => Promise<any>;

	const continueEmitter = new Emitter<{ continue: void }>();

	return {
		queueTask(newTask: () => Promise<any>) {
			lastTask = newTask;
			continueEmitter.call("continue", (null as unknown) as void);
		},
		stop() {
			stop = true;
		},
		async start() {
			while (!stop) {
				if (lastTask) {
					await lastTask();
				}
				if (!lastTask) {
					await new Promise((res) => continueEmitter.on("continue", res));
				}
			}
		},
	};
};
