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
