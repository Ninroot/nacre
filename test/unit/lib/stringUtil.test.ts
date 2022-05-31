import { describe, it } from "mocha";
import { assert } from "chai";
import { findCommonEndStart, completeEnd } from "../../../src/lib/stringUtil";

describe("stringUtil unit test", function () {
  describe("findCommonEndStart", function () {
    it("should return common string when it exists", function () {
      assert.strictEqual(findCommonEndStart("abcdef", "defghi"), "def");
    });

    it("should return empty string when no common string is found", function () {
      assert.strictEqual(findCommonEndStart("abcdef", "ghiklm"), "");
    });

    it("should return last common string many exist", function () {
      assert.strictEqual(findCommonEndStart("abcdefgabecdef", "defghi"), "def");
    });

    it("should handle corner cases", function () {
      assert.strictEqual(findCommonEndStart("", "defghi"), "");
      assert.strictEqual(findCommonEndStart("abcdef", ""), "");
      assert.strictEqual(findCommonEndStart(undefined, "defghi"), "");
      assert.strictEqual(findCommonEndStart("abcdef", undefined), "");
    });
  });

  describe("completeEnd", function () {
    it("should complete end of a line when it exists", function () {
      assert.strictEqual(completeEnd("this.is.an.exa", "example"), "mple");
    });
  });
});
