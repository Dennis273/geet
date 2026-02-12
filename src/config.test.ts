import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// We need to test config with a mock home directory to avoid touching real ~/.geetrc
// Since config.ts uses os.homedir() at module level, we test the core logic patterns

describe("config file operations", () => {
  const configPath = path.join(os.homedir(), ".geetrc");
  let originalContent: string | null = null;

  beforeEach(() => {
    if (fs.existsSync(configPath)) {
      originalContent = fs.readFileSync(configPath, "utf8");
    }
  });

  afterEach(() => {
    if (originalContent !== null) {
      fs.writeFileSync(configPath, originalContent);
    } else if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });

  test("getConfig returns empty object when no config file exists", async () => {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
    // Re-import to get fresh module
    const { getConfig } = await import("./config");
    const config = getConfig();
    expect(config).toEqual({});
  });

  test("setConfig persists values to disk", async () => {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
    const { getConfig, setConfig } = await import("./config");
    setConfig("repoRoot", "/tmp/repos");
    const config = getConfig();
    expect(config.repoRoot).toBe("/tmp/repos");
  });

  test("setConfig overwrites existing values", async () => {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
    const { getConfig, setConfig } = await import("./config");
    setConfig("repoRoot", "/tmp/old");
    setConfig("repoRoot", "/tmp/new");
    expect(getConfig().repoRoot).toBe("/tmp/new");
  });

  test("config file is valid JSON", async () => {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
    const { setConfig } = await import("./config");
    setConfig("repoRoot", "/tmp/test");
    const raw = fs.readFileSync(configPath, "utf8");
    expect(() => JSON.parse(raw)).not.toThrow();
  });
});
