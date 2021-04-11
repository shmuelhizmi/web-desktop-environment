import ManagerBase from "../../managerBase";

interface LoggingManagerEvents {}

export class LoggingManager extends ManagerBase<LoggingManagerEvents> {
  name = "logger";
  mount = this.registerFunction<
    (mountName: string, parentMountToken?: string) => { mountToken: string }
  >("mount");
  info = this.registerFunction<(token: string, message: string) => void>(
    "info"
  );
  warn = this.registerFunction<(token: string, message: string) => void>(
    "warn"
  );
  error = this.registerFunction<(token: string, message: string) => void>(
    "error"
  );
}

export default new LoggingManager();
