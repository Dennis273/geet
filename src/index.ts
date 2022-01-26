#!/usr/bin/env node
import program from "commander";
import { getConfig, setConfig } from "./config";
import { clone, error as gitError } from "./git";
import { SIGPIPE } from "constants";

program.version("0.1.0");

program
  .command("clone <url>")
  .option("-f, --force")
  .action(async (url, options) => {
    const repoRoot = getConfig()["repoRoot"];
    if (repoRoot) {
      try {
        const result = await clone(url, repoRoot, options.force);
        if (process.stdout.isTTY) {
          console.log(`Cloning into '${result}'`);
          console.log("Done.");
        } else {
          console.log(result);
          process.on("SIGPIPE", () => {
            process.exit;
          });
        }
      } catch (err) {
        let log = "";
        switch (err) {
          case gitError.ERR_TARGET_DIR_EXIST:
            log = "Target directory already exists, use --force to overwirte.";
            break;
          case gitError.ERR_URL_NOT_VALID:
            log = "Given url is not valid.";
            break;
          case gitError.ERR_EXT_NAME_NOT_GIT:
            log = "External name of given url is not '.git'.";
            break;
        }
        console.log(log);
        process.exit(1);
      }
    } else {
      console.error("Repo root is not set, use `geet set repoRoot <root>`.");
    }
  });

program.command("set <key> <value>").action((key, value) => {
  setConfig(key, value);
});

program.command("get <key>").action((key) => {
  getConfig()[key];
});

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
program.parse(process.argv);
