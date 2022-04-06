'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var path = require("path");
var cat = require("../../../src/builtins/cat");
var os_1 = require("os");
(0, mocha_1.describe)('cat unit test', function () {
    var originalFile = path.join(__dirname, 'fixtures', 'cat', 'original');
    var anotherFile = path.join(__dirname, 'fixtures', 'cat', 'another');
    (0, mocha_1.it)('cat file', function () {
        assert.equal(cat(originalFile), "This is a".concat(os_1.EOL, "test file").concat(os_1.EOL));
    });
    (0, mocha_1.it)('cat read file', function () {
        assert.deepEqual(cat.lines(originalFile), ['This is a', 'test file', '']);
    });
    (0, mocha_1.it)('cat write file', function () {
        assert.equal(cat.truncated(anotherFile, 'A test'), 'A test');
        assert.equal(cat(anotherFile), 'A test');
    });
    (0, mocha_1.it)('cat append file', function () {
        assert.equal(cat.truncated(anotherFile, ''), '');
        assert.equal(cat.append(anotherFile, 'A'), 'A');
        assert.equal(cat.append(anotherFile, 'test'), 'Atest');
    });
});
