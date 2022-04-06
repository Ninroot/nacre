'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var path = require("path");
var ls = require("../../../src/builtins/ls");
var cd = require("../../../src/builtins/cd");
(0, mocha_1.describe)('ls unit test', function () {
    var cwd;
    (0, mocha_1.before)('save current working directory', function () {
        cwd = process.cwd();
    });
    (0, mocha_1.after)('restore current working directory', function () {
        process.chdir(cwd);
    });
    (0, mocha_1.beforeEach)('move to current dir', function () {
        cd(__dirname);
    });
    (0, mocha_1.it)('should return a non empty array when no args', function () {
        cd(path.join(__dirname, 'fixtures', 'ls', 'basic'));
        assert.deepStrictEqual(ls(), ['a', 'b']);
    });
    (0, mocha_1.it)('should return a non empty array when recursive', function () {
        cd(path.join(__dirname, 'fixtures', 'ls', 'recursive'));
        var actual = ls.recursive();
        var expected = [
            'd1',
            'd1/d11',
            'd1/d11/f11',
            'd1/d11/f12',
            'd1/f1',
            'd2',
            'd2/f21',
            'f1',
        ].map(function (p) { return path.join(p); });
        assert.deepStrictEqual(actual, expected);
    });
    (0, mocha_1.it)('should fail when ls a file which does not exist', function () {
        assert.throws(function () { return ls('fileThatDoesNot.Exist'); });
    });
});
