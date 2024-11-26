import { readFile, stat, writeFile } from "node:fs/promises";
import { parse } from "yaml";

/**
 *
 * @param {string} cwd
 */
export async function moonToVscWorkspace(cwd, name) {
  const parentFolderName = name ?? cwd.split("/").pop();
  const workspaceFileName = `${cwd}/${parentFolderName}.code-workspace`;
  let currentWorkspaceFile = "";
  if (await fileExists(workspaceFileName)) {
    currentWorkspaceFile = await readFile(workspaceFileName, "utf-8");
  }
  let currentWorkspace = {};
  if (currentWorkspaceFile) {
    currentWorkspace = JSON.parse(currentWorkspaceFile);
  }
  currentWorkspace.folders = [
    {
      path: ".",
      name: "ROOT",
    },
  ];
  /**
   * @type {unknown}
   */
  let moonConfig = {};
  if (await fileExists(cwd + "/.moon/workspace.yml")) {
    moonConfig = parse(await readFile(cwd + "/.moon/workspace.yml", "utf-8"));
  }
  if (moonConfig?.projects) {
    for (const [key, value] of Object.entries(moonConfig.projects)) {
      currentWorkspace.folders.push({
        path: value,
        name: value,
      });
    }
  }

  if (!currentWorkspace.settings) {
    currentWorkspace.settings = {};
  }
  if (!currentWorkspace.settings["files.exclude"]) {
    currentWorkspace.settings["files.exclude"] = {};
  }
  if (!currentWorkspace.settings["files.exclude"]["services/**"]) {
    currentWorkspace.settings["files.exclude"]["services/**"] = true;
  }
  if (!currentWorkspace.settings["files.exclude"]["packages/**"]) {
    currentWorkspace.settings["files.exclude"]["packages/**"] = true;
  }
  await writeFile(workspaceFileName, JSON.stringify(currentWorkspace, null, 2));
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}
