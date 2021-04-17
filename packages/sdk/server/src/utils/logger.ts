import color from "chalk";

let globalLastLogDate = Date.now();

export default class Logger {
	level: string;
	constructor(level?: string) {
		if (level) {
			this.level = level;
		} else {
			this.level = color.bgBlack("root");
		}
	}
	private getCurrentLogDelay = () => {
		const now = Date.now();
		const currentLogDelay = now - globalLastLogDate;
		globalLastLogDate = now;
		if (currentLogDelay > 1000) {
			return currentLogDelay / 1000 + "sec";
		}
		return currentLogDelay + "ms";
	};
	private formatMessage = (message: string) => {
		if (message.includes("\n")) {
			return `
			-------------------message-----------------
			|${message.split("\n").reduce(
				(previousValue, currentValue) =>
					`${previousValue}
			|${currentValue}`
			)}
			-------------------------------------------
			`;
		} else {
			return message;
		}
	};

	public info = (message: string) => {
		console.info(
			`[ ${this.level} ]: ${color.green(
				this.formatMessage(message)
			)} ${this.getCurrentLogDelay()}`
		);
	};
	public error = (message: string) => {
		console.error(
			`[ ${this.level} ]: ${color.red(
				this.formatMessage(message)
			)} ${this.getCurrentLogDelay()}`
		);
	};
	public warn = (message: string) => {
		console.warn(
			`[ ${this.level} ]: ${color.yellow(
				this.formatMessage(message)
			)} ${this.getCurrentLogDelay()}`
		);
	};

	public mount = (levelName: string) => {
		return new Logger(`${this.level}:${this.randomBG(levelName)}`);
	};

	private randomBG = (text: string) => {
		const randomColor = () => {
			const r = Math.random() * 125 + 125; //not 255 to avoid black on black
			return r - (r % 1);
		};
		return color.black(
			color.bgRgb(randomColor(), randomColor(), randomColor())(text)
		);
	};
}
