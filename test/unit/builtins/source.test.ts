import { source } from "../../../src/builtins";
import { assert } from "chai";
import { before, describe, it } from "mocha";
import * as path from "path";

describe("source unit test", function () {
  describe("current working directory dependent import", function () {
    before("change current directory", function () {
      process.chdir(path.join(__dirname, "fixtures", "source"));
    });

    it("should resolve a local module", function () {
      assert.isTrue(source("modtest"));
      assert.isTrue(source("./modtest"));
    });
  });

  describe("nested current working directory dependent import", function () {
    before("change current directory", function () {
      process.chdir(
        path.join(
          __dirname,
          "fixtures",
          "source",
          "node_modules",
          "modtest",
          "nested"
        )
      );
    });

    it("should resolve a local module", function () {
      assert.isTrue(source("nestedmodtest"));
    });

    it("should not resolve a a local module in the parent directory", function () {
      assert.throw(() => source("modtest"), /Cannot find module/);
    });
  });
});
