import ManagerBase from "../../managerBase";

interface X11ManagerEvents {
  setActiveDisplay: number;
}

export class X11Manager extends ManagerBase<X11ManagerEvents> {
  name = "X11";
  getActiveDisplay = this.registerFunction<() => number>("getActiveDisplay");
  setActiveDisplay =
    this.registerFunction<(display: number) => void>("setActiveDisplay");
}

export default new X11Manager();
