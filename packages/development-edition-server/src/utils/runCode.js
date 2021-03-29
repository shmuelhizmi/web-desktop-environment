require("code-server/lib/vscode/out/vs/server/fork")

const loop = () => setTimeout(loop, 100);

loop();