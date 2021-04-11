import API from "../../../backend/index";

export class LoggingManager {
  token?: string;
  constructor(token?: string) {
    this.token = token;
  }
  mountGlobal(name: string) {
    return API.loggingManager.mount
      .execute(name, this.token)
      .then(({ mountToken }) => {
        this.token = mountToken;
        API.loggingManager.mount.override((callSuper) => {
          return (name, token) => {
            return callSuper(name, token || mountToken);
          };
        });
      });
  }
  async mount(name: string) {
    const { mountToken } = await API.loggingManager.mount.execute(
      name,
      this.token
    );
    return new LoggingManager(mountToken);
  }
  private throwTyingToLogFromRootLogger = () => {
    throw new Error("error - logging from root logger is not allowed");
  };
  info(message: string) {
    if (this.token) {
      API.loggingManager.info.execute(this.token, message);
    } else {
      this.throwTyingToLogFromRootLogger();
    }
  }
  warn(message: string) {
    if (this.token) {
      API.loggingManager.warn.execute(this.token, message);
    } else {
      this.throwTyingToLogFromRootLogger();
    }
  }
  error(message: string) {
    if (this.token) {
      API.loggingManager.error.execute(this.token, message);
    } else {
      this.throwTyingToLogFromRootLogger();
    }
  }
}

export default new LoggingManager();
