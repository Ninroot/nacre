'use strict';
var child_process_1 = require("child_process");
var errors_1 = require("./lib/errors");
var process_1 = require("process");
var sh = function (command) {
    if (!command) {
        return undefined;
    }
    try {
        var res = (0, child_process_1.execSync)(command);
        return res.toString();
    }
    catch (e) {
        if (e.stack.startsWith('Error: Command failed')) {
            throw new errors_1.default(e);
        }
    }
};
module.exports = (process_1.platform === 'win32') ? undefined : sh;
