'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
function touch(filepath) {
    var time = new Date();
    try {
        // change file access and modification times
        (0, fs_1.utimesSync)(filepath, time, time);
    }
    catch (_a) {
        (0, fs_1.closeSync)((0, fs_1.openSync)(filepath, 'w'));
    }
    return path.normalize(filepath);
}
exports.default = touch;
