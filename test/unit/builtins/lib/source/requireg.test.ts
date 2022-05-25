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

import {
  requireg,
  resolve,
} from "../../../../../src/builtins/lib/source/requireg";

const isWin32 = process.platform === "win32";
const homeVar = isWin32 ? "USERPROFILE" : "HOME";
const homePath = process.env[homeVar];

describe("requireg", function () {
  it("should resolve a builtin module", function () {
    assert.strictEqual(requireg("path"), path);
  });

  it("should throw an Error exception when the module does not exists", function () {
    assert.throw(() => requireg("nonexistent"));
  });

  describe("resolve via NODE_PATH", function () {
    before(function () {
      process.env.NODE_PATH = path.join(__dirname, "fixtures", "lib");
    });

    after(function () {
      process.env.NODE_PATH = "";
    });

    it("should resolve the beaker package", function () {
      assert.isTrue(requireg("beaker"));
    });

    it("should have the expected module path", function () {
      assert.equal(
        resolve("beaker", undefined),
        path.join(
          __dirname,
          "fixtures",
          "lib",
          "node_modules",
          "beaker",
          "index.js"
        )
      );
    });
  });

  describe("resolve via $HOME", function () {
    before(function () {
      process.env[homeVar] = path.join(__dirname, "fixtures", "lib");
    });

    after(function () {
      process.env[homeVar] = homePath;
    });

    it("should resolve the beaker package", function () {
      assert.isTrue(requireg("beaker"));
    });
  });

  describe("resolve via $NODE_MODULES", function () {
    before(function () {
      process.env.NODE_MODULES = path.join(__dirname, "fixtures", "lib");
    });

    after(function () {
      process.env.NODE_MODULES = "";
    });

    it("should resolve the beaker package", function () {
      assert.isTrue(requireg("beaker"));
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
      assert.isTrue(requireg("beaker"));
    });

    it("should have the expected module path", function () {
      assert.equal(
        resolve("beaker", undefined),
        path.join(
          __dirname,
          "fixtures",
          "lib",
          "node_modules",
          "beaker",
          "index.js"
        )
      );
    });
  });

  // describe("resolve via npm prefix", function () {
  //   var rc = require("rc");
  //
  //   before(function () {
  //     resolvers.__set__("rc", function () {
  //       return {
  //         prefix: path.join(__dirname, "fixtures", isWin32 ? "lib" : ""),
  //       };
  //     });
  //   });
  //
  //   after(function () {
  //     resolvers.__set__("rc", rc);
  //   });
  //
  //   it("should resolve the beaker package", function () {
  //     expect(requireg("beaker")).to.be.true;
  //   });
  //
  //   it("should have the expected module path", function () {
  //     expect(requireg.resolve("beaker")).to.be.equal(
  //       path.join(
  //         __dirname,
  //         "fixtures",
  //         "lib",
  //         "node_modules",
  //         "beaker",
  //         "index.js"
  //       )
  //     );
  //   });
  // });
});
