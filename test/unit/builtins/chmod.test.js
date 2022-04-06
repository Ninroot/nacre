'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var fs_1 = require("fs");
var assert = require("assert/strict");
var path = require("path");
var chmod = require("../../../src/builtins/chmod");
(0, mocha_1.describe)('chmod unit test', function () {
    var path0001 = path.join(__dirname, 'fixtures', 'chmod', 'test');
    var path0777 = path.join(__dirname, 'fixtures', 'chmod', 'test2');
    // eslint-disable-next-line func-names
    (0, mocha_1.before)(function () {
        if (process.platform === 'win32') {
            this.skip();
        }
    });
    (0, mocha_1.after)('give access back to test file for convenience', function () {
        (0, fs_1.chmodSync)(path0001, '0700');
    });
    (0, mocha_1.beforeEach)('remove all permission of the test file', function () {
        (0, fs_1.chmodSync)(path0001, '0001');
        (0, fs_1.chmodSync)(path0777, '0777');
    });
    (0, mocha_1.it)('chmod undefined', function () {
        assert.throws(function () { return chmod(); });
    });
    (0, mocha_1.it)('chmod', function () {
        var expect = {
            user: {
                read: false,
                write: false,
                execute: false,
            },
            group: {
                read: false,
                write: false,
                execute: false,
            },
            others: {
                read: false,
                write: false,
                execute: true,
            },
        };
        assert.deepStrictEqual(chmod(path0001), expect);
    });
    (0, mocha_1.it)('chmod.add.read', function () {
        var expect = {
            user: {
                read: true,
                write: false,
                execute: false,
            },
            group: {
                read: true,
                write: false,
                execute: false,
            },
            others: {
                read: true,
                write: false,
                execute: true,
            },
        };
        assert.deepStrictEqual(chmod.add.read(path0001), expect);
    });
    (0, mocha_1.it)('chmod.add.write', function () {
        var expect = {
            user: {
                read: false,
                write: true,
                execute: false,
            },
            group: {
                read: false,
                write: true,
                execute: false,
            },
            others: {
                read: false,
                write: true,
                execute: true,
            },
        };
        assert.deepStrictEqual(chmod.add.write(path0001), expect);
    });
    (0, mocha_1.it)('chmod.add.execute', function () {
        var expect = {
            user: {
                read: false,
                write: false,
                execute: true,
            },
            group: {
                read: false,
                write: false,
                execute: true,
            },
            others: {
                read: false,
                write: false,
                execute: true,
            },
        };
        assert.deepStrictEqual(chmod.add.execute(path0001), expect);
    });
    (0, mocha_1.it)('chmod.add.read.user', function () {
        var expect = {
            user: {
                read: true,
                write: false,
                execute: false,
            },
            group: {
                read: false,
                write: false,
                execute: false,
            },
            others: {
                read: false,
                write: false,
                execute: true,
            },
        };
        assert.deepStrictEqual(chmod.add.read.user(path0001), expect);
    });
    (0, mocha_1.it)('chmod.add.write.group', function () {
        var expect = {
            user: {
                read: false,
                write: false,
                execute: false,
            },
            group: {
                read: false,
                write: true,
                execute: false,
            },
            others: {
                read: false,
                write: false,
                execute: true,
            },
        };
        assert.deepStrictEqual(chmod.add.write.group(path0001), expect);
    });
    (0, mocha_1.it)('chmod.add.execute.others', function () {
        var expect = {
            user: {
                read: false,
                write: false,
                execute: false,
            },
            group: {
                read: false,
                write: false,
                execute: false,
            },
            others: {
                read: false,
                write: false,
                execute: true,
            },
        };
        assert.deepStrictEqual(chmod.add.execute.others(path0001), expect);
    });
    (0, mocha_1.it)('chmod.remove.execute', function () {
        var expect = {
            user: {
                read: true,
                write: true,
                execute: false,
            },
            group: {
                read: true,
                write: true,
                execute: false,
            },
            others: {
                read: true,
                write: true,
                execute: false,
            },
        };
        assert.deepStrictEqual(chmod.remove.execute(path0777), expect);
    });
    (0, mocha_1.it)('chmod.remove.execute.others', function () {
        var expect = {
            user: {
                read: true,
                write: true,
                execute: true,
            },
            group: {
                read: true,
                write: true,
                execute: true,
            },
            others: {
                read: true,
                write: true,
                execute: false,
            },
        };
        assert.deepStrictEqual(chmod.remove.execute.others(path0777), expect);
    });
    (0, mocha_1.it)('chmod.remove.execute', function () {
        var expect = {
            user: {
                read: true,
                write: true,
                execute: false,
            },
            group: {
                read: true,
                write: true,
                execute: false,
            },
            others: {
                read: true,
                write: true,
                execute: false,
            },
        };
        chmod.remove.execute.user(path0777);
        assert.deepStrictEqual(chmod.remove.execute(path0777), expect);
    });
    (0, mocha_1.it)('chmod.set.read', function () {
        var expect = {
            user: {
                read: true,
                write: false,
                execute: false,
            },
            group: {
                read: true,
                write: false,
                execute: false,
            },
            others: {
                read: true,
                write: false,
                execute: false,
            },
        };
        assert.deepStrictEqual(chmod.set.read(path0001), expect);
    });
    (0, mocha_1.it)('chmod.set', function () {
        var mode = {
            user: {
                read: true,
                write: false,
                execute: true,
            },
            group: {
                read: true,
                write: true,
                execute: true,
            },
            others: {
                read: true,
                write: false,
                execute: true,
            },
        };
        assert.deepStrictEqual(chmod.set(path0001, mode), mode);
    });
    (0, mocha_1.it)('chmod.set undefined', function () {
        assert.throws(function () { return chmod.set(path0001, undefined); });
    });
});
