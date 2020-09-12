import color from "chalk";

export default class Logger {
	level: string;
	constructor(level?: string) {
		if (level) {
			this.level = level;
		} else {
			this.level = color.bgBlack("root");
		}
	}
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
			`[ ${this.level} ]: ${color.green(this.formatMessage(message))}`
		);
	};
	public error = (message: string) => {
		console.error(
			`[ ${this.level} ]: ${color.red(this.formatMessage(message))}`
		);
	};
	public warn = (message: string) => {
		console.warn(
			`[ ${this.level} ]: ${color.yellow(this.formatMessage(message))}`
		);
	};

	public mount = (levelName: string) => {
		return new Logger(`${this.level}:${this.randomBG()(levelName)}`);
	};

	private randomBG = () => {
		const randomColor = () => {
			const r = Math.random() * 125; //not 255 to avoid white on white
			return r - (r % 1);
		};
		return color.bgRgb(randomColor(), randomColor(), randomColor());
	};
}
