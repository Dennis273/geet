import { URL } from "url";
import path from "path";
import fs from "fs";
import fse from "fs-extra";
import cp from "child_process";
enum Error {
  ERR_UNKNOWN,
  ERR_EXT_NAME_NOT_GIT,
  ERR_TARGET_DIR_EXIST,
  ERR_URL_NOT_VALID,
}

function clone(
  repoPath: string,
  localRoot: string,
  force: boolean
): Error | string {
  let gitUrl;
  try {
    gitUrl = new URL(repoPath);
  } catch (err) {
    throw Error.ERR_URL_NOT_VALID;
  }
  const protocol = gitUrl.protocol;
  const { dir, ext, name } = path.parse(
    path.join(gitUrl.hostname, gitUrl.pathname)
  );
  if (ext !== ".git") {
    throw Error.ERR_EXT_NAME_NOT_GIT;
  }
  const localPath = path.join(localRoot, dir, name);
  if (fs.existsSync(localPath)) {
    if (!force) {
      throw Error.ERR_TARGET_DIR_EXIST;
    } else {
      fse.removeSync(localPath);
    }
  } else {
    fs.mkdirSync(localPath, { recursive: true });
  }
  cloneSync(repoPath, localPath);
  return localPath;
}
function cloneSync(repoPath, localPath) {
  try {
    cp.execSync(`git clone ${repoPath} ${localPath}`);
  } catch (err) {}
}
export { clone, Error as error };
