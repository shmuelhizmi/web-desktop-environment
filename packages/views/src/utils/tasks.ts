import Emitter from "./Emitter";

export const lastTaskQueuer = () => {
	let stop = false;
	let lastTask: undefined | (() => Promise<any>);

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
					const currentTask = lastTask;
					lastTask = undefined;
					await currentTask();
				}
				if (!lastTask) {
					await new Promise((res) => continueEmitter.on("continue", res));
				}
			}
		},
	};
};
