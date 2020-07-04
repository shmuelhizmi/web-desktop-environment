
class PortManager {
  currentPort: number;
  constructor(startingPort: number) {
    this.currentPort = startingPort;
  }
  getPort = async () => {
    let isPortIsAvilable = false;
    while(!isPortIsAvilable) {
      this.currentPort++;
      isPortIsAvilable = await portIsAvilable(this.currentPort);
    }
    return this.currentPort;
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
