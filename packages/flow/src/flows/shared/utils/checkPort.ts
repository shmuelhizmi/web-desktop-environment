
class PortManager {
  currentPort: number;
  constructor(startingPort: number) {
    this.currentPort = startingPort;
  }
  getPort = async (starting?: number) => {
    if (starting) {
      let currentPort = starting;
      let isPortIsAvilable = false;
      while(!isPortIsAvilable) {
        isPortIsAvilable = await portIsAvilable(currentPort);
        if (!isPortIsAvilable) {
          currentPort++;
        }
      }
      return currentPort;

    }else {
      let isPortIsAvilable = false;
      while(!isPortIsAvilable) {
        this.currentPort++;
        isPortIsAvilable = await portIsAvilable(this.currentPort);
      }
      return this.currentPort;
      
    }
  }
}

export const portManager = new PortManager(9200);

export const portIsAvilable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const net = require("net");
    const server = net.createServer();

    server.once("error", function (err) {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      }
    });

    server.once("listening", function () {
        server.close();
        resolve(true);
    });

    server.listen(port);
  });
};
