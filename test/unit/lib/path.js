'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var path = require("../../../src/lib/path");
(0, mocha_1.describe)('path unit test', function () {
    (0, mocha_1.it)('is dir', function () {
        assert.equal(path.normalizeCurrent(''), '');
        assert.equal(path.normalizeCurrent('.'), '.');
        assert.equal(path.normalizeCurrent('./'), '');
        assert.equal(path.normalizeCurrent('./foo'), 'foo');
        assert.equal(path.normalizeCurrent('././foo'), 'foo');
        assert.equal(path.normalizeCurrent('./../foo'), path.normalize('../foo'));
    });
});
