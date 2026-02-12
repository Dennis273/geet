import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const rootPath = os.homedir();
const configFileName = ".geetrc";
const filePath = path.join(rootPath, configFileName);

interface Config {
  repoRoot?: string;
  [key: string]: string | undefined;
}

function readFileContent(): Config {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as Config;
  }
  return {};
}

function writeFileContent(content: Config): void {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), { flag: "w" });
}

export function getConfig(): Config {
  return readFileContent();
}

export function setConfig(key: string, value: string): void {
  const config = readFileContent();
  config[key] = value;
  writeFileContent(config);
}
