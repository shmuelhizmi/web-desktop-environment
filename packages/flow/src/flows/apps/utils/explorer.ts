import { Flow } from "@mcesystems/reflow";
import { ViewInterfacesType } from "@web-desktop-environment/interfaces/lib";
import { homedir } from "os";
import {
  Dowmload,
  File,
} from "@web-desktop-environment/interfaces/lib/views/apps/utils/Explorer";
import { promises as fs } from "fs";
import { join, sep } from "path";
import { App } from "..";

interface ExplorerInput {
  path?: string;
}

const terminalFlow = <Flow<ViewInterfacesType, ExplorerInput>>(async ({
  view,
  views,
  event,
  input: { path: startingPath = homedir() },
}) => {
  let currentPath = startingPath;
  const downloads: Dowmload[] = [];
  const listFiles = async (): Promise<File[]> => {
    const filesNames = await fs.readdir(currentPath, { encoding: "utf8" });
    const files = await filesNames.map(
      async (file): Promise<File> => {
        const stat = await fs.stat(join(currentPath, file));
        return {
          isFolder: stat.isDirectory(),
          name: file,
          size: stat.size,
          time: stat.atime.getTime(),
        };
      }
    );
    return Promise.all(files);
  };
  const explorer = view(0, views.explorer, {
    currentPath,
    downloads,
    platfromPathSperator: sep,
    files: await listFiles(),
  });

  explorer.on("changeCurrentPath", async (path) => {
    currentPath = path;
    explorer.update({
      currentPath,
      files: await listFiles(),
    });
  });

  explorer.on("createFolder", async (name) => {
    await fs.mkdir(join(currentPath, name));
    explorer.update({ files: await listFiles() });
  });

  explorer.on("delete", async (name) => {
    await fs.unlink(join(currentPath, name));
    explorer.update({ files: await listFiles() });
  });

  explorer.on("move", async ({ newPath, originalPath }) => {
    await moveFile(originalPath, newPath);
    explorer.update({ files: await listFiles() });
  });
  explorer.on("upload", async ({ data, path }) => {
    await fs.writeFile(path, data);
    explorer.update({ files: await listFiles() });
  });
  await explorer;
});

export const explorer: App<ExplorerInput> = {
  name: "Explorer",
  description: "a file explorer",
  flow: terminalFlow,
  defaultInput: {},
  icon: {
    type: "fluentui",
    icon: "FolderOpen",
  },
  window: {
    height: 600,
    width: 700,
    position: { x: 50, y: 50 },
  },
};

const moveFile = async (oldPath: string, newPath: string) => {
  try {
    await fs.rename(oldPath, newPath);
  } catch (err) {
    if (err.code === "EXDEV") {
      await fs.writeFile(newPath, await fs.readFile(oldPath));
      await fs.unlink(oldPath);
    } else {
      throw err;
    }
  }
};
