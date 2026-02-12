import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { GitError, clone } from "./git";

describe("clone", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "geet-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test("throws ERR_URL_NOT_VALID for invalid URL", () => {
    expect(() => clone("not-a-url", tmpDir, false)).toThrow(GitError.ERR_URL_NOT_VALID);
  });

  test("throws ERR_EXT_NAME_NOT_GIT for URL without .git extension", () => {
    expect(() => clone("https://github.com/user/repo", tmpDir, false)).toThrow(
      GitError.ERR_EXT_NAME_NOT_GIT,
    );
  });

  test("throws ERR_TARGET_DIR_EXIST when directory exists and force is false", () => {
    const repoDir = path.join(tmpDir, "github.com", "user", "repo");
    fs.mkdirSync(repoDir, { recursive: true });
    expect(() => clone("https://github.com/user/repo.git", tmpDir, false)).toThrow(
      GitError.ERR_TARGET_DIR_EXIST,
    );
  });

  test("throws ERR_CLONE_FAILED for unreachable repository", () => {
    expect(() => clone("https://example.invalid/user/repo.git", tmpDir, false)).toThrow(
      GitError.ERR_CLONE_FAILED,
    );
  });

  test("creates correct local path structure from URL", () => {
    // This will fail at clone step but we can verify path parsing logic
    // by checking that the directory was created before clone attempt
    try {
      clone("https://github.com/testuser/testrepo.git", tmpDir, false);
    } catch {
      // Expected to fail (no real git server)
    }
    const expectedDir = path.join(tmpDir, "github.com", "testuser", "testrepo");
    expect(fs.existsSync(expectedDir)).toBe(true);
  });

  test("removes existing directory when force is true", () => {
    const repoDir = path.join(tmpDir, "github.com", "user", "repo");
    fs.mkdirSync(repoDir, { recursive: true });
    const markerFile = path.join(repoDir, "marker.txt");
    fs.writeFileSync(markerFile, "should be removed");

    try {
      clone("https://github.com/user/repo.git", tmpDir, true);
    } catch {
      // Clone will fail but directory should have been wiped
    }
    expect(fs.existsSync(markerFile)).toBe(false);
  });
});
