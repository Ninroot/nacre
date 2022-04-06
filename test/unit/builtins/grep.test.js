'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var grep_1 = require("../../../src/builtins/grep");
(0, mocha_1.describe)('grep test', function () {
    (0, mocha_1.it)('grep', function () {
        var actual = ['abc', 'bcd', 'efg'].filter((0, grep_1.default)(/bc/));
        assert.deepEqual(actual, ['abc', 'bcd']);
    });
    (0, mocha_1.it)('grep empty string', function () {
        var actual = ['abc', 'bcd', 'efg'].filter((0, grep_1.default)(/''/));
        assert.deepEqual(actual, []);
    });
    (0, mocha_1.it)('grep throws', function () {
        assert.throws(function () { return (0, grep_1.default)(); }, {
            message: 'Regex required',
        });
    });
});
