'use strict';
var path = require("path");
var fs_1 = require("fs");
var mkdir = function (dirpath) {
    path.normalize(dirpath);
    (0, fs_1.mkdirSync)(dirpath, { recursive: false });
    return path.normalize(dirpath);
};
mkdir.recursive = function (dirpath) {
    path.normalize(dirpath);
    (0, fs_1.mkdirSync)(dirpath, { recursive: true });
    return path.normalize(dirpath);
};
module.exports = mkdir;
