import fs from "fs";
import path from "path";
import os from "os";
const rootPath = os.homedir();
const configFileName = ".geetrc"; // json
const filePath = path.join(rootPath, configFileName);

interface IConfig {
  repoRoot?: string;
}

function readFileContent() {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    const config = JSON.parse(content);
    return config as IConfig;
  } else {
    return {} as IConfig;
  }
}

function writeFileContent(content: any) {
  fs.writeFileSync(filePath, JSON.stringify(content), { flag: "w" });
}

function getConfig() {
  return readFileContent();
}

function setConfig(key: string, value: any) {
  const config = readFileContent();
  config[key] = value;
  writeFileContent(config);
}

export { getConfig, setConfig };
