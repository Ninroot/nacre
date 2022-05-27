// MIT License (MIT)
//
// Copyright 2013 Tomas Aparicio
// Copyright 2022 Arnaud Debec
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

import { assert } from "chai";
import { describe, it, before, after } from "mocha";
import * as path from "path";

import * as resolvers from "../../../../../src/builtins/lib/source/resolvers";

const isWin32 = process.platform === "win32";

describe("resolvers unit test", function () {
  const expectedBeaker = path.join(
    __dirname,
    "fixtures",
    "lib",
    "node_modules",
    "beaker",
    "index.js"
  );

  describe("resolve builtin module", function () {
    it("should resolve a builtin module", function () {
      assert.strictEqual(resolvers.builtinResolve("path"), "path");
    });

    it("should return undefined when resolve a non builtin module", function () {
      assert.isUndefined(resolvers.builtinResolve("mocha"));
      assert.isUndefined(resolvers.builtinResolve("nonexistent"));
    });
  });

  describe("resolve local module", function () {
    it("should resolve a local module", function () {
      assert.strictEqual(
        resolvers.localResolve(
          "beaker",
          path.join(__dirname, "fixtures", "lib")
        ),
        expectedBeaker
      );
    });
  });

  describe("resolve via $NODE_PATH", function () {
    const nodePath = process.env.NODE_PATH;

    before(function () {
      process.env.NODE_PATH = path.join(__dirname, "fixtures", "lib");
    });

    after(function () {
      // prevent "undefined" as a string to be set in the env var
      process.env.NODE_PATH = nodePath ? nodePath : "";
    });

    it("should have the expected module path", function () {
      assert.equal(
        resolvers.nodePathResolve("beaker", undefined),
        expectedBeaker
      );
    });
  });

  describe("resolve via $HOME / %USERPROFILE%", function () {
    const homeVar = isWin32 ? "USERPROFILE" : "HOME";
    const homePath = process.env[homeVar];

    before(function () {
      process.env[homeVar] = path.join(__dirname, "fixtures", "lib");
    });

    after(function () {
      process.env[homeVar] = homePath ? homePath : "";
    });

    it("should resolve the beaker package", function () {
      assert.strictEqual(resolvers.userHomeResolve("beaker"), expectedBeaker);
    });
  });

  describe("resolve via $NODE_MODULES", function () {
    const nodeModules = process.env.NODE_MODULES;

    before(function () {
      process.env.NODE_MODULES = path.join(__dirname, "fixtures", "lib");
    });

    after(function () {
      process.env.NODE_MODULES = nodeModules ? nodeModules : "";
    });

    it("should resolve the beaker package", function () {
      assert.strictEqual(
        resolvers.nodeModulesResolve("beaker"),
        expectedBeaker
      );
    });
  });

  describe("resolve via node execution path", function () {
    const execPath = process.execPath;

    before(function () {
      process.execPath = path.join(
        __dirname,
        "fixtures",
        isWin32 ? "lib" : "bin",
        "node"
      );
    });

    after(function () {
      process.execPath = execPath;
    });

    it("should resolve the beaker package", function () {
      assert.strictEqual(resolvers.execPathResolve("beaker"), expectedBeaker);
    });
  });
});
