'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var path = require("path");
var assert = require("assert/strict");
var cd = require("../../../src/builtins/cd");
(0, mocha_1.describe)('cd unit test', function () {
    var cwd;
    (0, mocha_1.before)('save current working directory', function () {
        cwd = process.cwd();
    });
    (0, mocha_1.after)('restore current working directory', function () {
        process.chdir(cwd);
    });
    (0, mocha_1.it)('should accept cd .', function () {
        assert.equal(typeof cd('.'), 'string');
    });
    (0, mocha_1.it)('should accept cd without arg', function () {
        assert.equal(typeof cd(), 'string');
    });
    (0, mocha_1.it)('should accept cd /', function () {
        assert.equal(cd('/../..'), path.resolve('/'));
    });
    (0, mocha_1.it)('should accept cd to previous', function () {
        assert.equal(typeof cd.previous(), 'string');
    });
    (0, mocha_1.it)('should accept cd to home', function () {
        assert.equal(typeof cd.home(), 'string');
    });
});
