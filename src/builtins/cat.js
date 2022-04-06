'use strict';
var fs_1 = require("fs");
var os_1 = require("os");
// Open file for reading. An exception occurs if the file does not exist.
var cat = function (filepath) { return (0, fs_1.readFileSync)(filepath, {
    encoding: 'utf-8',
    flag: 'r',
}); };
cat.lines = function (filepath) { return cat(filepath).split(os_1.EOL); };
// Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
cat.truncated = function (filepath, string) {
    (0, fs_1.writeFileSync)(filepath, string, {
        encoding: 'utf8',
        flag: 'w',
    });
    return string;
};
// Appends in synchronous mode. The file is created if it does not exist.
cat.append = function (filepath, string) {
    (0, fs_1.appendFileSync)(filepath, string, {
        encoding: 'utf8',
        flag: 'as+',
    });
    return cat(filepath);
};
module.exports = cat;
