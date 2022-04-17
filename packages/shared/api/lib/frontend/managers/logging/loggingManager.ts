import API from "../../../backend/index";

export class LoggingManager {
  token?: Promise<string | undefined>;
  constructor(token?: Promise<string>) {
    this.token = token || Promise.resolve(undefined);
  }
  async mountGlobal(name: string) {
    const oldTokenPromise = this.token;
    this.token = new Promise<string>((res) => {
      oldTokenPromise.then((oldToken) => {
        API.loggingManager.mount
        .execute(name, oldToken)
        .then(({ mountToken }) => {
          API.loggingManager.mount.override((callSuper) => {
            return (name, token) => {
              return callSuper(name, token || mountToken);
            };
          });
          res(mountToken);
        });
      })
    })
  }
  mount(name: string) {
    const newToken = this.token.then((parentToken) => API.loggingManager.mount.execute(
      name,
      parentToken
    ).then(({ mountToken }) => mountToken))
    .catch(() => null);
    return new LoggingManager(newToken);
  }
  private throwTyingToLogFromRootLogger = () => {
    throw new Error("error - logging from root logger is not allowed");
  };
  async info(message: string) {
    if (this.token) {
      API.loggingManager.info.execute(await this.token, message);
    } else {
      this.throwTyingToLogFromRootLogger();
    }
  }
  async warn(message: string) {
    if (this.token) {
      API.loggingManager.warn.execute(await this.token, message);
    } else {
      this.throwTyingToLogFromRootLogger();
    }
  }
  async error(message: string) {
    if (this.token) {
      API.loggingManager.error.execute(await this.token, message);
    } else {
      this.throwTyingToLogFromRootLogger();
    }
  }
}

export default new LoggingManager();
