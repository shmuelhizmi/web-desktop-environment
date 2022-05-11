import API from "../../../backend/index";

export class X11Manager {
  setActiveDisplay(display: number) {
    API.x11Manager.setActiveDisplay.execute(display);
    API.x11Manager.call("setActiveDisplay", display);
  }
  getActiveDisplay() {
    return API.x11Manager.getActiveDisplay.execute();
  }
}

export default new X11Manager();
