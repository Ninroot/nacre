'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var sh = require("../../../src/builtins/sh");
(0, mocha_1.describe)('sh unit test', function () {
    // eslint-disable-next-line func-names
    (0, mocha_1.before)(function () {
        // sh is not present for windows
        if (process.platform === 'win32') {
            this.skip();
        }
    });
    (0, mocha_1.it)('should return string when ls', function () {
        assert.equal(typeof sh('ls'), 'string');
    });
    (0, mocha_1.it)('should return undefined when no arg', function () {
        assert.equal(sh(), undefined);
    });
    (0, mocha_1.it)('should return string when echo', function () {
        assert.equal(sh('echo "Hello world!"'), 'Hello world!\n');
    });
    (0, mocha_1.it)('should raise an exception when existing command status differs from 0', function () {
        assert.throws(function () {
            sh('npm');
        }, {
            name: 'CommandFailedError',
            message: 'Command failed: npm',
            status: 1,
            signal: null,
            stdout: /Usage/,
            stderr: '',
        });
    });
    (0, mocha_1.it)('should fail if command does not exist', function () {
        assert.throws(function () {
            sh('commandThatShouldNotExist');
        }, {
            name: 'CommandFailedError',
            status: 127,
        });
    });
});
