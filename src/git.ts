
import { URL } from 'url'
import path from 'path'
import fs from 'fs'
import simpleGit from "simple-git";

enum result {
  EXT_NAME_NOT_GIT,
  TARGET_DIR_EXIST,
  UNKNOWN,
  SUCCESS,
}

const git = simpleGit()

function clone(repoPath: string, localRoot: string, force: boolean): result {
  const gitUrl = new URL(repoPath)
  const protocol = gitUrl.protocol
  const { dir, ext, name } = path.parse(path.join(gitUrl.hostname, gitUrl.pathname))
  if (ext !== '.git') {
    return result.EXT_NAME_NOT_GIT
  }
  const localPath = path.join(localRoot, dir, name)
  if (fs.existsSync(localPath)) {
    if (!force) {
      return result.TARGET_DIR_EXIST
    }
  } else {
    fs.mkdirSync(localPath, { recursive: true })
  }
  git.clone(repoPath, localPath)
  return result.SUCCESS
}

export {
  clone,
  result
}