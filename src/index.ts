#!/usr/bin/env node
import { Command } from "commander";
import { getConfig, setConfig } from "./config";
import { GitError, clone } from "./git";

const program = new Command();

program.name("geet").description("A command line tool to help handle git repo.").version("0.0.0");

program
  .command("clone <url>")
  .description("Clone a git repository into the configured repo root")
  .option("-f, --force", "overwrite existing directory")
  .action((url: string, options: { force?: boolean }) => {
    const config = getConfig();
    const repoRoot = config.repoRoot;

    if (!repoRoot) {
      console.error("Repo root is not set, use `geet set repoRoot <root>`.");
      process.exit(1);
    }

    try {
      const result = clone(url, repoRoot, options.force ?? false);
      if (process.stdout.isTTY) {
        console.log("Done.");
      } else {
        console.log(result);
      }
    } catch (err) {
      switch (err) {
        case GitError.ERR_TARGET_DIR_EXIST:
          console.error("Target directory already exists, use --force to overwrite.");
          break;
        case GitError.ERR_URL_NOT_VALID:
          console.error("Given URL is not valid.");
          break;
        case GitError.ERR_EXT_NAME_NOT_GIT:
          console.error("Extension of given URL is not '.git'.");
          break;
        case GitError.ERR_CLONE_FAILED:
          console.error("Git clone command failed.");
          break;
        default:
          console.error("An unknown error occurred.");
      }
      process.exit(1);
    }
  });

program
  .command("set <key> <value>")
  .description("Set a configuration value")
  .action((key: string, value: string) => {
    setConfig(key, value);
    console.log(`Set ${key} = ${value}`);
  });

program
  .command("get <key>")
  .description("Get a configuration value")
  .action((key: string) => {
    const value = getConfig()[key];
    if (value !== undefined) {
      console.log(value);
    } else {
      console.error(`Key "${key}" is not set.`);
      process.exit(1);
    }
  });

program.parse();
