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

	public direct(message: string) {
		console.info(message);
	}

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
		return new Logger(`${this.level}:${this.calculateBG(levelName)}`);
	};

	private calculateBG = (text: string) => {
		const hash = `#${hashFnv32a(text, true, 19)}}`;
		return color.black(color.bgHex(hash)(text));
	};
}

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {boolean} [asString=false] set to true to return the hash value as
 *     6-digit hex string instead of an integer
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer | string}
 */
function hashFnv32a<AsString extends boolean>(
	str: string,
	asString: AsString,
	seed: number
): AsString extends true ? string : number {
	/*jshint bitwise:false */
	let i,
		l,
		hval = seed === undefined ? 0x811c9dc5 : seed;

	for (i = 0, l = str.length; i < l; i++) {
		hval ^= str.charCodeAt(i);
		hval +=
			(hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
	}
	if (asString) {
		// Convert to 8 digit hex string
		return ("0000000" + (hval >>> 0).toString(16)).substr(
			-6
		) as AsString extends true ? string : number;
	}
	return (hval >>> 0) as AsString extends true ? string : number;
}
