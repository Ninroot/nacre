'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var path = require("path");
var stat = require("../../../src/builtins/stat");
(0, mocha_1.describe)('chown unit test', function () {
    var chown;
    // chown is not available on Windows
    // eslint-disable-next-line func-names
    (0, mocha_1.before)(function () {
        if (process.platform === 'win32') {
            this.skip();
        }
        else {
            // skip does not prevent importation
            chown = require('../../../src/builtins/chown');
        }
    });
    var testFile = path.join(__dirname, 'fixtures', 'chown', 'test');
    (0, mocha_1.it)('chown', function () {
        assert.throws(function () { return chown(); });
    });
    (0, mocha_1.it)('chown file', function () {
        var actual = chown(testFile);
        assert.ok(actual.owner.length > 0);
        assert.ok(actual.group.length > 0);
    });
    (0, mocha_1.it)('chown get file', function () {
        var actual = chown.get(testFile);
        assert.ok(actual.owner.length > 0);
        assert.ok(actual.group.length > 0);
    });
    (0, mocha_1.it)('chown set file same username and group', function () {
        var _a = stat(testFile), owner = _a.owner, group = _a.group;
        var actual = chown.set(testFile, owner, group);
        assert.equal(actual.owner, owner);
        assert.equal(actual.group, group);
    });
    (0, mocha_1.it)('chown set file', function () {
        assert.throws(function () { return chown.set(testFile); });
    });
    (0, mocha_1.it)('chown set file only username', function () {
        var owner = stat(testFile).owner;
        assert.throws(function () { return chown.set(testFile, owner); });
    });
    (0, mocha_1.it)('chown set file number', function () {
        assert.throws(function () { return chown.set(testFile, 123, 456); });
    });
    (0, mocha_1.it)('chown set file unknown username', function () {
        var unknownUser = 'thisShouldBeAnUnknownUserForTestingOnly';
        assert.throws(function () { return chown.set(testFile, unknownUser); });
    });
});
