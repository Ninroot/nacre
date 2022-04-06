'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var _chmod_1 = require("../../../../src/builtins/lib/_chmod");
(0, mocha_1.describe)('chmod lib unit test', function () {
    (0, mocha_1.it)('modeToOctal', function () {
        assert.deepStrictEqual((0, _chmod_1.modeToOctal)({
            user: { read: false, write: false, execute: false },
            group: { read: false, write: false, execute: false },
            others: { read: false, write: false, execute: false },
        }), 0);
        assert.deepStrictEqual((0, _chmod_1.modeToOctal)({
            user: { read: true, write: false, execute: false },
            group: { read: false, write: true, execute: false },
            others: { read: false, write: false, execute: true },
        }), 273);
        assert.deepStrictEqual((0, _chmod_1.modeToOctal)({
            user: { read: true, write: true, execute: true },
            group: { read: true, write: true, execute: true },
            others: { read: true, write: true, execute: true },
        }), 511);
    });
});
