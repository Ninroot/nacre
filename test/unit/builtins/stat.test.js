'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var path = require("path");
var assert = require("assert/strict");
var stat = require("../../../src/builtins/stat");
(0, mocha_1.describe)('stat unit test', function () {
    var windows = process.platform === 'win32';
    function testOwnership(statFile) {
        if (windows) {
            assert.equal(typeof statFile.owner, 'undefined');
        }
        else {
            assert.equal(typeof statFile.owner, 'string');
        }
    }
    (0, mocha_1.it)('should recognize a basic directory', function () {
        var s = stat(path.join(__dirname, 'fixtures', 'stat', 'foo'));
        assert.equal(s.type, 'directory');
        assert.equal(typeof s.size, 'number');
        testOwnership(s);
    });
    (0, mocha_1.it)('should recognize a basic file', function () {
        var s = stat(path.join(__dirname, 'fixtures', 'stat', 'foo', 'empty.file'));
        assert.equal(s.type, 'file');
        testOwnership(s);
    });
    (0, mocha_1.it)('should recognize a symbolic link file', function () {
        var s = stat(path.join(__dirname, 'fixtures', 'stat', 'symbolicLink.file'));
        assert.equal(s.type, 'symbolicLink');
    });
    // eslint-disable-next-line func-names
    (0, mocha_1.it)('should recognize a character file', function () {
        if (windows) {
            this.skip();
        }
        var s = stat(path.join('/dev', 'zero'));
        assert.equal(s.type, 'character');
    });
    (0, mocha_1.it)('should fail for non existing file', function () {
        assert.throws(function () { return stat(path.join(__dirname, 'fixtures', 'stat', 'foo', 'doesnotexist.file')); });
    });
});
