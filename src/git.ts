import cp from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export enum GitError {
  ERR_UNKNOWN = "ERR_UNKNOWN",
  ERR_EXT_NAME_NOT_GIT = "ERR_EXT_NAME_NOT_GIT",
  ERR_TARGET_DIR_EXIST = "ERR_TARGET_DIR_EXIST",
  ERR_URL_NOT_VALID = "ERR_URL_NOT_VALID",
  ERR_CLONE_FAILED = "ERR_CLONE_FAILED",
}

function cloneSync(repoPath: string, localPath: string): void {
  const result = cp.spawnSync("git", ["clone", repoPath, localPath], {
    stdio: "pipe",
  });
  if (result.status !== 0) {
    const stderr = result.stderr?.toString().trim();
    throw new Error(`git clone failed: ${stderr || "unknown error"}`);
  }
}

export function clone(repoPath: string, localRoot: string, force: boolean): string {
  let gitUrl: URL;
  try {
    gitUrl = new URL(repoPath);
  } catch {
    throw GitError.ERR_URL_NOT_VALID;
  }

  const { dir, ext, name } = path.parse(path.join(gitUrl.hostname, gitUrl.pathname));

  if (ext !== ".git") {
    throw GitError.ERR_EXT_NAME_NOT_GIT;
  }

  const localPath = path.join(localRoot, dir, name);

  if (fs.existsSync(localPath)) {
    if (!force) {
      throw GitError.ERR_TARGET_DIR_EXIST;
    }
    fs.rmSync(localPath, { recursive: true, force: true });
  } else {
    fs.mkdirSync(localPath, { recursive: true });
  }

  try {
    cloneSync(repoPath, localPath);
  } catch {
    throw GitError.ERR_CLONE_FAILED;
  }

  return localPath;
}
