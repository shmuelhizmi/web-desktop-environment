import * as color from "chalk";

export default class Logger {
  level: string;
  constructor(level: string) {
    this.level = level;
  }
  info = (message: string) => {
    console.info(
      `[ ${color.greenBright(`${this.level}`)} ]: ${color.green(message)}`
    );
  };
  error = (message: string) => {
    console.error(
      `[ ${color.redBright(`${this.level}`)} ]: ${color.red(message)}`
    );
  };
  warn = (message: string) => {
    console.warn(
      `[ ${color.yellowBright(`${this.level}`)} ]: ${color.yellow(message)}`
    );
  };
  mount = (levelName: string) => new Logger(`${this.level}:${levelName}`);
}
