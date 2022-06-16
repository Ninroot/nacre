"use strict";

import { describe, it } from "mocha";
import { spawn } from "child_process";
import { assert } from "chai";

import path = require("path");

function run(...args): any {
  return new Promise((res) => {
    const proc = spawn(process.execPath, ["index.js", ...args], {
      cwd: path.join(__dirname, "..", "..", "built"),
    });
    const out = [];
    const err = [];
    proc.stdout.on("data", (data) => out.push(data));
    proc.stderr.on("data", (data) => err.push(data));
    proc.on("close", (code, signal) => {
      res({
        code,
        signal,
        stdout: Buffer.concat(out).toString("utf8"),
        stderr: Buffer.concat(err).toString("utf8"),
      });
    });
  });
}

describe("index unit test", () => {
  it("--version", async () => {
    const actual = await run("--version");
    assert.match(actual.stdout, /[0-9]+\.[0-9]+\.[0-9]+/);
  });

  it("--help", async () => {
    const actual = await run("--help");
    assert.ok(actual.stdout.includes("Usage"), `Should be ${actual.stdout}`);
  });

  it("--evaluate 1+1", async () => {
    const actual = await run("--evaluate", "1+1");
    assert.ok(actual.stdout.includes("2"), `Should be ${actual.stdout}`);
  });

  it("--evaluate stat('.')", async () => {
    const actual = await run("--evaluate", "stat('.')");
    assert.ok(actual.stdout.includes("\"type\":\"directory\""), `Should be ${actual.stdout}`);
  });
});
