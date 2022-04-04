'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var child_process_1 = require("child_process");
var assert = require("assert/strict");
var cwd;
(0, mocha_1.before)('save current working directory', function () {
    cwd = process.cwd();
});
(0, mocha_1.after)('restore current working directory', function () {
    process.chdir(cwd);
});
(0, mocha_1.describe)('scripting unit test', function () {
    (0, mocha_1.it)('should import pwd builtin', function () {
        var actual = (0, child_process_1.execSync)('node ./built/index.js ./test/lib/fixtures/scripting/pwd.js', { cwd: cwd });
        assert.ok(actual.toString().includes(cwd));
    });
});
