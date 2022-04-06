'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var mod_1 = require("../../../../src/builtins/lib/mod");
(0, mocha_1.describe)('mod unit test', function () {
    (0, mocha_1.it)('add', function () {
        assert.equal((0, mod_1.add)(0, 1), 1);
        assert.equal((0, mod_1.add)(1, 1), 1);
        assert.equal((0, mod_1.add)(511, 1), 511);
    });
    (0, mocha_1.it)('remove', function () {
        assert.equal((0, mod_1.remove)(0, 1), 0);
        assert.equal((0, mod_1.remove)(1, 1), 0);
        assert.equal((0, mod_1.remove)(511, 1), 510);
        assert.equal((0, mod_1.remove)(7, 61), 2);
    });
});
