import * as color from "chalk";

export default class Logger {
  level: string;
  constructor(level: string) {
    this.level = level;
  }
  info = (message: string) => {
    console.info(`[ ${this.level} ]: ${color.green(message)}`);
  };
  error = (message: string) => {
    console.error(`[ ${this.level} ]: ${color.red(message)}`);
  };
  warn = (message: string) => {
    console.warn(`[ ${this.level} ]: ${color.yellow(message)}`);
  };
  mount = (levelName: string) => {
    const randomColor = () => {
      const r = Math.random() * 255;
      return r - (r % 1);
    };
    return new Logger(
      `${this.level}:${color.bgRgb(
        randomColor(),
        randomColor(),
        randomColor()
      )(levelName)}`
    );
  };
}
